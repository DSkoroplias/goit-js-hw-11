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

async function onSearch(e) {
  e.preventDefault();

  const {
    elements: { searchQuery },
  } = e.currentTarget;

  const searchValue = searchQuery.value.trim().toLowerCase();

  if (!searchValue) {
    Notify.failure('What would you like to see?');
    return;
  }

  apiSearch.resetPage();

  apiSearch.searchQuery = searchValue;
  const data = await apiSearch.fetchPicture();

  console.log(data);

  if (data.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  Notify.success(`Hooray! We found ${data.totalHits} images.`);

  const markup = getHitsTpl(data.hits);

  refs.gallery.innerHTML = markup;
  lightbox.refresh();
  refs.loadMoreBtn.removeAttribute('disabled');
}

async function onLoadMore(e) {
  apiSearch.incrementPage();
  const data = await apiSearch.fetchPicture();

  const markup = getHitsTpl(data.hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  apiSearch.incrementPage();
  lightbox.refresh();

  const totalPage = (await data.totalHits) / 40;
  if (apiSearch.page >= totalPage) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMoreBtn.setAttribute('disabled', true);
  }
}

const lightbox = new SimpleLightbox('.gallery a', {
  navText: ['←', '→'],
  captionsData: 'alt',
  captionDelay: '250',
  doubleTapZoom: '2',
});

function appendHitsMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', getHitsTpl(hits));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
