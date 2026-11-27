import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FORMS } from '../../core/data/resources.data';
import { SeoService } from '../../core/services/seo.service';
import { LinkGroups } from '../../shared/link-groups/link-groups';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-forms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHero, LinkGroups],
  template: `<app-page-hero
      eyebrow="Client tools"
      heading="Forms"
      lead="Download commonly requested tax forms. Links go to the official IRS and Illinois sources, so you always get the current version."
    />
    <app-link-groups [groups]="groups" icon="file" />`,
})
export default class Forms {
  protected readonly groups = FORMS;
  constructor() {
    inject(SeoService).update({
      title: 'Forms',
      description:
        'Download W-4, W-9, estimated tax, extension and other common IRS and Illinois tax forms.',
      path: '/forms',
    });
  }
}
