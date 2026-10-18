"""Evidence references must remain attributable and available in the static deck."""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class PrototypeFeedbackTests(unittest.TestCase):
    def setUp(self):
        source = (ROOT / 'public/index.html').read_text()
        self.slide = source.split('<section class="slide dark customer-story-slide"', 1)[1].split('</section>', 1)[0]

    def test_all_five_supplied_emails_are_present_and_loadable(self):
        gallery = self.slide.split('class="feedback-gallery"', 1)[1].split('</article>', 1)[0]
        images = re.findall(r'src="(feedback/[^"]+)"', gallery)
        self.assertEqual(set(images), {f'feedback/{name}.png' for name in ('priya', 'jordan', 'maya', 'alex', 'samira')})
        self.assertEqual(len(images), 5)
        for image in images:
            self.assertEqual((ROOT / 'public' / image).read_bytes()[:8], b'\x89PNG\r\n\x1a\n')

    def test_focused_outcome_has_matching_provenance(self):
        quote = 'injection case stopped working; existing search tests passed.'
        self.assertIn(quote, re.sub('<[^>]+>', '', self.slide))
        self.assertIn(quote, (ROOT / 'docs/prototype-feedback.md').read_text())
        self.assertIn('Reported prototype result', self.slide)
        self.assertIn('VC quote to be added.', self.slide)

    def test_two_boxes_then_separate_focus_build(self):
        self.assertEqual(self.slide.count('class="validation-box '), 2)
        self.assertIn('data-build="2"', self.slide)
        self.assertIn('class="customer-phase cp2"', self.slide)
        self.assertIn('class="email-result-highlight"', self.slide)


if __name__ == '__main__':
    unittest.main()
