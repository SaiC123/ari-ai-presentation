"""Evidence references must remain attributable and available in the static deck."""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class PrototypeFeedbackTests(unittest.TestCase):
    def setUp(self):
        source = (ROOT / 'public/index.html').read_text()
        self.source = source
        self.slide = source.split('<section class="slide dark customer-story-slide feedback-slide"', 1)[1].split('</section>', 1)[0]

    def test_all_five_supplied_emails_are_present_and_loadable(self):
        gallery = self.slide.split('class="feedback-gallery"', 1)[1].split('</article>', 1)[0]
        images = re.findall(r'src="(feedback/[^"]+)"', gallery)
        self.assertEqual(set(images), {f'feedback/{name}.png' for name in ('priya', 'jordan', 'maya', 'alex', 'samira')})
        self.assertEqual(len(images), 5)
        for image in images:
            self.assertEqual((ROOT / 'public' / image).read_bytes()[:8], b'\x89PNG\r\n\x1a\n')

    def test_focused_outcome_has_matching_provenance(self):
        quote = 'I also added 12 new injection test cases and those are passing as well.'
        self.assertIn(quote, re.sub('<[^>]+>', '', self.slide))
        self.assertIn(quote, (ROOT / 'docs/prototype-feedback.md').read_text())
        self.assertIn('Reported prototype result', self.slide)
        self.assertNotIn('class="vc-placeholder"', self.slide)
        self.assertIn('Samira’s request', self.slide)
        self.assertIn('Next improvement:', self.slide)

    def test_gallery_then_separate_focus_build(self):
        self.assertEqual(self.slide.count('class="validation-box '), 1)
        self.assertIn('data-build="1"', self.slide)
        self.assertIn('class="customer-phase cp2"', self.slide)
        self.assertNotIn('email-result-highlight', self.slide)
        self.assertNotIn('email-preview-highlight', self.slide)
        self.assertNotIn('<mark>', self.slide)

    def test_evidence_follows_prototype_before_financials(self):
        main = self.source.split('<main id="presentation-slides-wrapper"', 1)[1].split('</main>', 1)[0]
        slides = re.findall(r'<section class="slide[\s\S]*?</section>', main)
        self.assertEqual(len(slides), 19)
        self.assertIn('customer-story-slide', slides[5])
        self.assertIn('PROPOSED CUSTOMER PROFILE', slides[5])
        self.assertNotIn('feedback-gallery', slides[5])
        self.assertNotIn('data-build=', slides[5])
        self.assertIn('logo-only-slide', slides[6])
        self.assertIn('product-overview-slide', slides[7])
        self.assertIn('Meet Ari:', slides[7])
        self.assertIn('Three Layers of Security', slides[7])
        self.assertEqual(slides[7].count('class="capability"'), 3)
        self.assertIn('code-reviewer-slide', slides[8])
        self.assertIn('prototype/code-review-intent.png', slides[8])
        self.assertIn('Check each commit', slides[8])
        self.assertIn('agent-detail-slide', slides[9])
        self.assertEqual(slides[8].count('class="product-point"'), 3)
        self.assertIn('defense-lab-slide', slides[10])
        self.assertIn('prototype/defense-lab-recorded.png', slides[10])
        self.assertIn('designed for 24/7 monitoring', slides[10])
        self.assertIn('Practice-trained AI recommends.', slides[10])
        self.assertEqual(slides[10].count('class="product-point"'), 3)
        self.assertNotIn('Defense Lab is the ongoing layer', slides[9])
        self.assertNotIn('ongoing-protection', slides[9])
        self.assertNotIn('1,500', slides[7])
        self.assertIn('docs, comments and tests', slides[8])
        self.assertIn('Draft the smallest fix', slides[8])
        self.assertIn('Only its tools.', slides[9])
        self.assertIn('Your team approves merges.', slides[9])
        self.assertIn('No AI output counts as proof. Including ours.', slides[9])
        self.assertNotIn('class="slide team-slide"', main)
        self.assertIn('Three teams. Separate jobs.', slides[9])
        self.assertEqual(slides[9].count('data-team="red"'), 3)
        self.assertEqual(slides[9].count('data-team="blue"'), 3)
        self.assertEqual(slides[9].count('data-team="independent"'), 1)
        self.assertIn('market-position-slide', slides[11])
        self.assertIn('Kairo founder', slides[11])
        self.assertIn('quality-slide', slides[12])
        self.assertIn('prototype-capture-slide', slides[12])
        self.assertIn('feedback-slide', slides[13])
        self.assertIn('feedback-gallery', slides[13])
        self.assertIn('finance-slide', slides[14])


if __name__ == '__main__':
    unittest.main()
