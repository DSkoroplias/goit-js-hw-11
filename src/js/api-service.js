import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const KEY = '5015491-f4a8c4738cac6b55ae413895f';

export default class ApiSearch {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPicture() {
    const resp = await axios.get(
      `${URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
    );
    const data = resp.data;
    // console.log(data);
    if (resp.status !== 200) {
      throw new Error(resp.status);
    }

    this.incrementPage();
    return data.hits;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
