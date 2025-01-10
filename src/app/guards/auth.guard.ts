import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../shared/local-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const localStr = inject(LocalStorageService)
  const router = inject(Router)
  if (localStr.getItem("isUserLoggedIn") && localStr.getItem('isUserLoggedIn') === true) {
    return true;
  } else {
    router.navigate(['/welcome'])
    return false
  }
};
