import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NearbyCompaniesComponent } from './pages/nearby-companies/nearby-companies.component';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { HeaderComponent } from "./shared/components/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NearbyCompaniesComponent, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CleanHiv';
}
