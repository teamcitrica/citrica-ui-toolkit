'use client';
import React from 'react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import clsx from 'clsx';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';

export interface CarouselItem {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface CarouselProps {
  items: CarouselItem[];
  autoplay?: boolean;
  autoplayDelay?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  className?: string;
  slideClassName?: string;
  breakpoints?: {
    [key: number]: {
      slidesPerView: number;
      centeredSlides?: boolean;
      spaceBetween: number;
    };
  };
}

type SwiperButtonProps = {
  children: React.ReactNode;
  direction: 'next' | 'prev';
};

export const SwiperButton = ({ children, direction }: SwiperButtonProps) => {
  const swiper = useSwiper();
  const handleClick = () => {
    if (direction === 'next') {
      swiper.slideNext();
    } else {
      swiper.slidePrev();
    }
  };
  return <Button onClick={handleClick}>{children}</Button>;
};

const defaultBreakpoints = {
  640: {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 10,
  },
  768: {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 10,
  },
  1024: {
    slidesPerView: 3,
    centeredSlides: false,
    spaceBetween: 30,
  },
};

const Carousel = ({
  items,
  autoplay = false,
  autoplayDelay = 3000,
  showPagination = true,
  showNavigation = false,
  loop = false,
  className,
  slideClassName,
  breakpoints = defaultBreakpoints,
}: CarouselProps) => {
  const modules = [
    ...(showPagination ? [Pagination] : []),
    ...(showNavigation ? [Navigation] : []),
    ...(autoplay ? [Autoplay] : []),
  ];

  return (
    <Swiper
      pagination={showPagination ? { clickable: true } : false}
      navigation={showNavigation}
      autoplay={autoplay ? { delay: autoplayDelay } : false}
      loop={loop}
      breakpoints={breakpoints}
      modules={modules}
      className={clsx('mySwiper !pb-7', className)}
    >
      {items.map((item) => (
        <SwiperSlide key={item.id} className={slideClassName}>
          <picture>
            <img
              className="max-h-[644px] w-full object-cover"
              src={item.src}
              alt={item.alt}
            />
          </picture>
          {(item.title || item.description) && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-2 rounded">
              {item.title && <Text variant="label" textColor='white'>{item.title}</Text>}
              {item.description && <Text variant="label" textColor='white'>{item.description}</Text>}
            </div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
