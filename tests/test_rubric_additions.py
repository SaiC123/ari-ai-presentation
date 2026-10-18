import re
import unittest
from pathlib import Path

class RubricAdditionsTests(unittest.TestCase):
    def setUp(self):
        source = (Path(__file__).resolve().parents[1] / 'public/index.html').read_text()
        main = source.split('<main id="presentation-slides-wrapper"', 1)[1].split('</main>', 1)[0]
        self.slides = re.findall(r'<section class="slide[\s\S]*?</section>', main)

    def test_hypothetical_label_and_benchmark_scope(self):
        self.assertIn('Hypothetical founder', self.slides[0])
        self.assertIn('45% failed security tests', self.slides[3])
        self.assertIn('https://www.veracode.com/blog/genai-code-security-report/', self.slides[3])
        self.assertIn('benchmark samples, not all AI code', self.slides[3])

    def test_competitor_landscape_has_sources_and_staged_positioning(self):
        slide = self.slides[9]
        names = ('GitHub Code Security', 'Semgrep', 'SonarQube', 'Snyk', 'Aikido', 'Veracode', 'Checkmarx', 'XBOW', 'Pentera')
        links = re.findall(r'<a class="map-vendor[^"]*" href="(https://[^"]+)"[^>]*><b>([^<]+)</b>', slide)
        self.assertEqual(tuple(name for _, name in links), names)
        self.assertEqual(len({url for url, _ in links}), 9)
        self.assertEqual(slide.count('class="map-cluster"'), 3)
        self.assertIn('Qualitative grouping, not a ranking', slide)
        self.assertIn('Capabilities overlap across all three groups.', slide)
        self.assertIn('Proposed small-team workflow · Prototype', slide)
        self.assertIn('Human-approved repairs', slide)
        self.assertEqual(set(re.findall(r'data-build="(\d+)"', slide)), {'1', '2'})
        self.assertIn('class="landscape-ari"', slide)
        self.assertNotIn('class="landscape-ari" data-build=', slide)

    def test_comparison_and_roadmap_have_limits_and_resources(self):
        for text in ('Snyk', 'Semgrep', 'GitHub Code Security', 'Tradeoff:', 'not yet validated'):
            self.assertIn(text, self.slides[9])
        for text in ('Month 1', 'Months 2–3', 'Months 4–6', 'Enterprise gate', 'Proposed timelines'):
            self.assertIn(text, self.slides[15])
        self.assertEqual(self.slides[15].count('<em>Needs</em>'), 5)
        self.assertEqual(self.slides[15].count('<em>Risk</em>'), 5)
        self.assertEqual(len(self.slides), 18)

if __name__ == '__main__':
    unittest.main()
