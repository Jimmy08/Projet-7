import axios from 'axios';
import { API_ROUTES } from '../utils/constants';

export function storeInLocalStorage(token, userId) {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
}

export function getFromLocalStorage(item) {
  return localStorage.getItem(item);
}

export async function getAuthenticatedUser() {
  const defaultReturnObject = { authenticated: false, user: null };
  try {
    const token = getFromLocalStorage('token');
    const userId = getFromLocalStorage('userId');
    if (!token) {
      return defaultReturnObject;
    }
    return { authenticated: true, user: { userId, token } };
  } catch (err) {
    console.error('getAuthenticatedUser, Something Went Wrong', err);
    return defaultReturnObject;
  }
}

export async function getBooks() {
  try {
    const token = getFromLocalStorage('token');
    console.log('Fetching books from:', `${API_ROUTES.BOOKS}`);
    console.log('Using token:', token);
    const response = await axios({
      method: 'GET',
      url: `${API_ROUTES.BOOKS}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const books = response.data;
    console.log('Fetched books:', books);
    return books;
  } catch (err) {
    console.error('Error fetching books:', err);
    return [];
  }
}

export async function getBook(id) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_ROUTES.BOOKS}/${id}`,
      headers: {
        Authorization: `Bearer ${getFromLocalStorage('token')}`,
      },
    });
    const book = response.data;
    book.id = book._id;
    return book;
  } catch (err) {
    console.error('Error fetching book:', err);
    return null;
  }
}

export async function getBestRatedBooks() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_ROUTES.BEST_RATED}`,
      headers: {
        Authorization: `Bearer ${getFromLocalStorage('token')}`,
      },
    });
    return response.data;
  } catch (e) {
    console.error('Error fetching best rated books:', e);
    return [];
  }
}

export async function deleteBook(id) {
  try {
    await axios.delete(`${API_ROUTES.BOOKS}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return true;
  } catch (err) {
    console.error('Error deleting book:', err);
    return false;
  }
}

export async function rateBook(id, userId, rating) {
  const data = {
    userId,
    rating: parseInt(rating, 10),
  };

  try {
    const response = await axios.post(`${API_ROUTES.BOOKS}/${id}/rating`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const book = response.data;
    book.id = book._id;
    return book;
  } catch (e) {
    console.error('Error rating book:', e);
    return e.message;
  }
}

export async function addBook(data) {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  console.log('Token used for adding book:', token); // Ajout de log pour le token
  const book = {
    userId,
    title: data.title,
    author: data.author,
    year: data.year,
    genre: data.genre,
    ratings: [{
      userId,
      grade: data.rating ? parseInt(data.rating, 10) : 0,
    }],
    averageRating: parseInt(data.rating, 10),
  };
  const bodyFormData = new FormData();
  bodyFormData.append('book', JSON.stringify(book));
  bodyFormData.append('image', data.file[0]);

  try {
    const response = await axios({
      method: 'post',
      url: `${API_ROUTES.BOOKS}`,
      data: bodyFormData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Book added successfully:', response.data); // Ajout de log pour la réponse
    return response.data;
  } catch (err) {
    console.error('Error adding book:', err.response ? err.response.data : err.message);
    return { error: true, message: err.message };
  }
}

export async function updateBook(data, id) {
  const userId = localStorage.getItem('userId');

  let newData;
  const book = {
    userId,
    title: data.title,
    author: data.author,
    year: data.year,
    genre: data.genre,
  };
  if (data.file[0]) {
    newData = new FormData();
    newData.append('book', JSON.stringify(book));
    newData.append('image', data.file[0]);
  } else {
    newData = { ...book };
  }

  try {
    const newBook = await axios({
      method: 'put',
      url: `${API_ROUTES.BOOKS}/${id}`,
      data: newData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return newBook;
  } catch (err) {
    console.error('Error updating book:', err);
    return { error: true, message: err.message };
  }
}
