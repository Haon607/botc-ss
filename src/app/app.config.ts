import { APP_INITIALIZER, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { CharacterDetailsService } from './services/character-details.service';

export function initCharacters(cds: CharacterDetailsService) {
    return () => cds.init();
}

export const appConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        {
            provide: APP_INITIALIZER,
            useFactory: initCharacters,
            deps: [CharacterDetailsService],
            multi: true,
        },
    ],
};
