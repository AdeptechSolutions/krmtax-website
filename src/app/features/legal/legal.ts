import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/data/site.config';
import { SeoService } from '../../core/services/seo.service';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-legal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHero],
  template: `<app-page-hero heading="Terms of service and disclaimer" />
    <section class="section">
      <div class="container narrow prose">
        <h2>Information only</h2>
        <p>
          This website is made available by {{ site.name }} as a service to our clients and others
          for informational purposes only. These materials and information should not be considered
          as, or a substitute for, accounting, tax or financial advice. You should seek professional
          counsel before acting on any information on this site.
        </p>
        <h2>No warranty</h2>
        <p>
          While we strive to keep the information accurate and current, we make no warranties about
          its completeness or accuracy. Calculators are provided for illustration only.
        </p>
        <h2>Links to other sites</h2>
        <p>
          Links to third-party websites are provided for convenience. We do not endorse and are not
          responsible for the content of those sites.
        </p>
        <h2>Security</h2>
        <p>
          Email and website forms are not guaranteed to be secure. Please do not send Social
          Security numbers or other sensitive information this way. Use our secure client portal to
          share documents.
        </p>
        <h2>Copyright</h2>
        <p>
          Reproduction of part or all of the contents of this site in any form is prohibited other
          than for individual use.
        </p>
      </div>
    </section>`,
})
export default class Legal {
  protected readonly site = SITE;
  constructor() {
    inject(SeoService).update({
      title: 'Terms & Disclaimer',
      description: 'Terms of service and disclaimer for the KRM Financial Services website.',
      path: '/legal',
    });
  }
}
