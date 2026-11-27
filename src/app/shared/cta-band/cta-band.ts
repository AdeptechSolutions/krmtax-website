import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/data/site.config';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-cta-band',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `<section class="cta-band">
    <div class="container cta-band__inner">
      <div>
        <h2>Ready to take the stress out of taxes?</h2>
        <p>Talk with us about your return, your business or your plans for next year.</p>
      </div>
      <div class="cta-band__actions">
        <a class="btn btn--accent" routerLink="/book">Book an appointment</a>
        <a class="btn btn--ghost-light" [href]="site.phoneHref"
          ><app-icon name="phone" [size]="18" /> {{ site.phone }}</a
        >
      </div>
    </div>
  </section>`,
})
export class CtaBand {
  protected readonly site = SITE;
}
