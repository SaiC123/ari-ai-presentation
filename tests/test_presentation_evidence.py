"""Keep evidence boundaries, human disclosures and the actual speaker script aligned."""
import html
from html.parser import HTMLParser
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class PresentationEvidenceTests(unittest.TestCase):
    def setUp(self):
        self.source = (ROOT / 'public/index.html').read_text()
        main = self.source.split('<main id="presentation-slides-wrapper"', 1)[1].split('</main>', 1)[0]
        self.slides = re.findall(r'<section class="slide[\s\S]*?</section>', main)

    def test_script_speakers_and_word_budget(self):
        script = (ROOT / 'docs/speaker-script.md').read_text()
        passages = [html.unescape(re.search(r'data-spoken="([^"]+)"', s).group(1)) for s in self.slides]
        self.assertEqual(len(passages), 20)
        self.assertLess(sum(len(p.split()) for p in passages), 700)
        # The coordinated note-alignment pass must preserve the finalized script verbatim.
        sections = re.findall(r'^## (.+)\n\n([\s\S]*?)(?=^## |\Z)', script, re.M)
        slide_sections = [(title, body) for title, body in sections if title.startswith('Slide ')]
        self.assertEqual(len(slide_sections), 20)
        for n, (title, body) in enumerate(slide_sections, 1):
            speaker = 'Sarosh' if n <= 6 or n >= 19 else 'Srihith' if n <= 12 else 'Vihaan' if n == 13 else 'Sai'
            self.assertEqual(title, f'Slide {n} · {speaker}')
            self.assertTrue(body.strip())
            self.assertEqual(passages[n-1], body.strip())
            note = html.unescape(re.search(r'data-note="([^"]+)"', self.slides[n-1]).group(1))
            self.assertEqual(note.split('\n\nREFERENCE, NOT SPOKEN:', 1)[0], 'SPOKEN: '+body.strip())
        self.assertEqual([title for title, _ in sections if not title.startswith('Slide ')], [])
        prepared = ' '.join(body for _, body in sections)
        self.assertLessEqual(len(re.findall(r"[\w]+(?:[’'][\w]+)?", prepared)), 700)
        self.assertNotIn('[ADD', prepared)
        self.assertNotIn('data-duration-s=', ''.join(self.slides))

    def test_team_introduction_precedes_agents_and_keeps_evidence_controls(self):
        slide = self.slides[9]
        spoken = html.unescape(re.search(r'data-spoken="([^"]+)"', slide).group(1))
        self.assertLess(spoken.index('Independent Verify checks repairs.'), spoken.index('Scout maps weaknesses.'))
        self.assertLess(slide.index('Three teams. Separate jobs.'), slide.index('class="node-copy copy1"'))
        self.assertEqual(set(re.findall(r'data-build="(\d+)"', slide)), {str(i) for i in range(1, 9)})
        for control in ('required tools', 'isolated app copies', 'people approve changes', 'No AI output counts as proof'):
            self.assertIn(control, spoken)
        self.assertIn('border:2px solid var(--team-color)!important', self.source)
        self.assertIn('border-width:3px!important', self.source)

    def test_slide_five_attributes_are_well_formed(self):
        class SectionParser(HTMLParser):
            attributes = None
            def handle_starttag(self, tag, attrs):
                if tag == 'section':
                    self.attributes = dict(attrs)
        parser = SectionParser()
        parser.feed(self.slides[4])
        self.assertEqual(set(parser.attributes), {'class', 'data-note', 'data-spoken'})
        self.assertNotIn('<', parser.attributes['data-spoken'])
        self.assertEqual(self.slides[4].count('</span>'), 1)

    def test_distinct_evidence_and_no_empty_vc_panel(self):
        self.assertNotIn('class="why-equals"', self.slides[3])
        self.assertIn('Separate evidence: attack activity', self.slides[3])
        self.assertIn('No causal link to AI coding established', self.slides[3])
        self.assertIn('Illustrative liability scenario', self.slides[2])
        self.assertNotIn('class="vc-placeholder"', self.slides[13])
        self.assertIn('planned, not yet validated', self.slides[13])
        self.assertIn('Presentation access', self.slides[12])

    def test_plans_remain_goals_with_decision_gates(self):
        self.assertIn('PROPOSED FIRST RECRUITMENT MILESTONE', self.slides[16])
        self.assertIn('Total paid goal', self.slides[16])
        self.assertIn('positive observed contribution', self.slides[16])
        for label in ('Owner:', '<em>Exit</em>', '<em>If unmet</em>'):
            self.assertEqual(self.slides[17].count(label), 5)
        self.assertIn('Publisher proxy, not a qualified-buyer count', self.slides[15])

    def test_originality_and_feedback_permission_are_attributed(self):
        disclosure = (ROOT / 'docs/originality-disclosure.md').read_text()
        self.assertIn('repository owner stated', disclosure)
        self.assertIn('None of it was built beforehand', disclosure)
        self.assertIn('permission for the 5 feedback emails', disclosure)
        self.assertIn('third-party', disclosure)

if __name__ == '__main__':
    unittest.main()
