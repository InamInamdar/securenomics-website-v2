import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class SeoService {

    constructor(private title: Title, private meta: Meta) { }

    updateSeo(title: string, description: string) {
        this.title.setTitle(title);

        this.meta.updateTag({
            name: 'description',
            content: description
        });
    }
}