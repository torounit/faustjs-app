import { PageComponent } from './[...pageUri]';
import { PostComponent } from './posts/[postSlug]';
import { BookComponent } from './books/[bookSlug]';
import { BookIdType, client } from 'client';
import { useRouter } from 'next/router';

export default function Preview() {
  const { usePreview, useQuery } = client.auth;
  const result = usePreview();

  const {
    query: { p, post_type: postType },
  } = useRouter();
  const { book: bookQuery } = useQuery();

  if (client.useIsLoading() || !result) {
    return <p>loading...</p>;
  }

  if ( postType === 'book' ) {
    const book = bookQuery({
      id: p as string ?? '',
      idType: BookIdType.DATABASE_ID,
    });

    const mostRecentPostRevision = book?.revisions({ first: 1 })?.edges?.[0]
      ?.node;
   const bookPost =  mostRecentPostRevision?.id ? mostRecentPostRevision : book

    return <BookComponent book={bookPost} />
  }

  if (result.type === 'page') {
    if (!result.page) {
      return <>Not Found</>;
    }

    return <PageComponent page={result.page} />;
  }

  if (!result.post) {
    return <>Not Found</>;
  }

  return <PostComponent post={result.post} />;
}
