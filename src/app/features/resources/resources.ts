import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RESOURCE_LINKS } from '../../core/data/resources.data';
import { SeoService } from '../../core/services/seo.service';
import { LinkGroups } from '../../shared/link-groups/link-groups';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-resources',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHero, LinkGroups],
  template: `<app-page-hero
      eyebrow="Client tools"
      heading="Helpful links"
      lead="Quick access to tax agencies, refund status, payments and other useful sites."
    />
    <app-link-groups [groups]="groups" icon="link" />`,
})
export default class Resources {
  protected readonly groups = RESOURCE_LINKS;
  constructor() {
    inject(SeoService).update({
      title: 'Helpful Links',
      description:
        'Links to the IRS, Illinois Department of Revenue, refund status, tax payments and more.',
      path: '/resources',
    });
  }
}
