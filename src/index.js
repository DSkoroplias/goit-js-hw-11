import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import './css/styles.css';
import { getHitsTpl } from './js/gallery';
import ApiSearch from './js/api-service';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const apiSearch = new ApiSearch();

refs.loadMoreBtn.setAttribute('disabled', true);

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  apiSearch.query = e.currentTarget.elements.searchQuery.value.trim();

  if (!apiSearch.query) {
    Notify.failure('What would you like to see?');
    return;
  }

  apiSearch.resetPage();

  apiSearch
    .fetchPicture()
    .then(hits => {
      if (hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        clearGallery();
        appendHitsMarkup(hits);
        gallery.refresh();

        refs.loadMoreBtn.removeAttribute('disabled');
      }
    })
    .catch(error => {
      console.log(error);
    });
}

const gallery = new SimpleLightbox('.gallery a', {
  navText: ['←', '→'],
  captionsData: 'alt',
  captionDelay: '250',
  doubleTapZoom: '2',
});

function onLoadMore() {
  apiSearch.fetchPicture().then(appendHitsMarkup);
}

function appendHitsMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', getHitsTpl(hits));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
