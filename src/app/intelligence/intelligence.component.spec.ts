import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {AppComponent} from "../app.component";
import {NavbarComponent} from "../navbar/navbar.component";
import {IndexComponent} from "../index/index.component";
import {ResultsComponent} from "../results/results.component";
import {NotFoundComponent} from "../not-found/not-found.component";
import {AdvancedsearchComponent} from "../advancedsearch/advancedsearch.component";
import {SearchBarComponent} from "../search-bar/search-bar.component";
import {FooterNavbarComponent} from "../footer-navbar/footer-navbar.component";
import {AboutComponent} from "../about/about.component";
import {ContactComponent} from "../contact/contact.component";
import {ModalComponent} from "ng2-bs3-modal/components/modal";
import {RouterTestingModule} from "@angular/router/testing";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {KnowledgeapiService} from "../services/knowledgeapi.service";
import {reducer} from "../reducers/index";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {RelatedSearchComponent} from "../related-search/related-search.component";
import {AutoCompleteComponent} from "../auto-complete/auto-complete.component";
import { ThemeComponent } from '../theme/theme.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import {IntelligenceComponent} from "../intelligence/intelligence.component";
import {IntelligenceService} from "../services/intelligence.service";
import {InfoboxComponent} from "../infobox/infobox.component";
import {AutoCorrectComponent} from "../auto-correct/auto-correct.component";

describe('IntelligenceComponent', () => {
    let component: IntelligenceComponent;
    let fixture: ComponentFixture < IntelligenceComponent > ;

    beforeEach(async (() => {
        TestBed.configureTestingModule({
                imports: [
                    RouterTestingModule,
                    BrowserModule,
                    CommonModule,
                    FormsModule,
                    HttpModule,
                    JsonpModule,
                    StoreModule.provideStore(reducer),
                ],
                declarations: [
                    IntelligenceComponent
                ],
                providers: [
                    IntelligenceService
                ],
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntelligenceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
