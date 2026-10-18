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
        self.assertEqual(len(passages), 18)
        self.assertLess(sum(len(p.split()) for p in passages), 700)
        # The authorized polishing handoff changes the script, not public slide notes.
        sections = re.findall(r'^## (.+)\n\n([\s\S]*?)(?=^## |\Z)', script, re.M)
        slide_sections = [(title, body) for title, body in sections if title.startswith('Slide ')]
        self.assertEqual(len(slide_sections), 18)
        for n, (title, body) in enumerate(slide_sections, 1):
            speaker = 'Sarosh' if n <= 6 or n >= 17 else 'Srihith' if n <= 11 else 'Sai'
            self.assertEqual(title, f'Slide {n} · {speaker}')
            self.assertTrue(body.strip())
        self.assertEqual([title for title, _ in sections if not title.startswith('Slide ')],
                         ['Prototype after slide 11 · Vihaan'])
        prepared = ' '.join(body for _, body in sections)
        self.assertLessEqual(len(re.findall(r"[\w]+(?:[’'][\w]+)?", prepared)), 700)
        self.assertNotIn('[ADD', prepared)
        self.assertNotIn('data-duration-s=', ''.join(self.slides))

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
        self.assertNotIn('class="vc-placeholder"', self.slides[11])
        self.assertIn('planned, not yet validated', self.slides[11])
        self.assertIn('Presentation access', self.slides[10])

    def test_plans_remain_goals_with_decision_gates(self):
        self.assertIn('PROPOSED FIRST RECRUITMENT MILESTONE', self.slides[14])
        self.assertIn('Total paid goal', self.slides[14])
        self.assertIn('positive observed contribution', self.slides[14])
        for label in ('Owner:', '<em>Exit</em>', '<em>If unmet</em>'):
            self.assertEqual(self.slides[15].count(label), 5)
        self.assertIn('Seeking five SaaS design partners', self.slides[17])
        self.assertIn('Publisher proxy, not a qualified-buyer count', self.slides[13])

    def test_originality_and_feedback_permission_are_attributed(self):
        disclosure = (ROOT / 'docs/originality-disclosure.md').read_text()
        self.assertIn('repository owner stated', disclosure)
        self.assertIn('None of it was built beforehand', disclosure)
        self.assertIn('permission for the 5 feedback emails', disclosure)
        self.assertIn('third-party', disclosure)

if __name__ == '__main__':
    unittest.main()
