import { useState, useEffect } from 'react';

import { PixabayAPIService } from '../utils/pixabay-api';

import { Loader } from './Loader/Loader';
import { Searchbar } from './Searchbar/Searchbar';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { Container } from './App.styled';
import { Message } from './Message/Message';

const pixabayAPIService = new PixabayAPIService();

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchApi() {
      try {
        setIsLoadMore(false);
        if (query === '') return;

        setIsLoad(true);
        setError(false);

        pixabayAPIService.page = page;
        pixabayAPIService.query = query;
        const newImages = await pixabayAPIService.fetchImages();

        setImages(prev => [...prev, ...newImages]);
        setIsLoadMore(pixabayAPIService.isMore());
      } catch (error) {
        setError(true);
      } finally {
        setIsLoad(false);
      }
    }

    fetchApi();
  }, [page, query]);

  const onSubmit = async values => {
    const newQuery = values.query.trim();
    if (query === newQuery) return;

    setQuery(values.query);
    setPage(1);
    setImages([]);
  };

  const onLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const closeModal = () => {
    setSelectedImage({});
    setShowModal(false);
  };

  const onShowImage = image => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const isNotFound = images.length === 0 && query !== '' && !isLoad && !error;

  return (
    <Container>
      <Searchbar onSubmit={onSubmit} />

      {images.length !== 0 && (
        <ImageGallery images={images} onShowImage={onShowImage} />
      )}

      {isNotFound && (
        <Message
          text="Sorry, but we couldn't find any results for your query."
          color="blue"
        />
      )}

      {error && <Message text="Oops, something went wrong..." color="red" />}

      {isLoadMore && <Button onClick={onLoadMore} />}
      {isLoad && <Loader />}
      {showModal && <Modal image={selectedImage} closeModal={closeModal} />}
    </Container>
  );
};
