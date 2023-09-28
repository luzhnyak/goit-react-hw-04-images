import { createPortal } from 'react-dom';

import { ModalWrapper, Overlay } from './Modal.styled';
import { useEffect } from 'react';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ image, closeModal }) => {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  const handleClick = event => {
    if (event.target.nodeName === 'DIV') {
      closeModal();
    }
  };

  const { large, description } = image;

  return createPortal(
    <Overlay onClick={handleClick}>
      <ModalWrapper>
        <img src={large} alt={description} />
      </ModalWrapper>
    </Overlay>,
    modalRoot
  );
};
