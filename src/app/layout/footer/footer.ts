import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE, fullAddress } from '../../core/data/site.config';
import { SERVICES } from '../../core/data/services.data';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly site = SITE;
  protected readonly address = fullAddress;
  protected readonly services = SERVICES;
  protected readonly year = new Date().getFullYear();
}
