import 'server-only';

import type { Prisma } from '@prisma/client';

import { prisma } from '@/prisma/prisma-client';

import type { HomePageReview } from '../_components/reviews-types';

const reviewInclude = {
  user: {
    select: {
      id: true,
      name: true,
      surname: true,
    },
  },
} satisfies Prisma.ReviewInclude;

const reviewDateFormatter = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function formatAuthor(name: string, surname: string) {
  return [name, surname].filter(Boolean).join(' ').trim();
}

export async function getHomePageReviews(): Promise<HomePageReview[]> {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        comment: {
          not: null,
        },
      },
      include: reviewInclude,
      orderBy: {
        createdAt: 'desc',
      },
      take: 12,
    });

    return reviews.flatMap((review) => {
      const text = review.comment?.trim();

      if (!text) {
        return [];
      }

      const author = formatAuthor(review.user.name, review.user.surname);

      return [
        {
          id: review.id,
          text,
          author: author || 'Гість готелю',
          date: reviewDateFormatter.format(review.createdAt),
        },
      ];
    });
  } catch (error) {
    console.error('Failed to load homepage reviews', error);

    return [];
  }
}
