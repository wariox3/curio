import { inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
// import { AlertaService } from "../services/alerta.service";

export class GeneralClass {
    //   protected alerta = inject(AlertaService)
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
  protected store = inject(Store)

  constructor() { }
}
