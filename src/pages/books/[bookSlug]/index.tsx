import { getNextStaticProps, Is404Config } from '@faustjs/next';
import isNil from 'lodash/isNil';
import { BookIdType, client, Book } from 'client';
import { Footer, Header, Hero } from 'components';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Node, WithRevisions } from '@faustjs/react/dist/cjs/client';
import { RequiredQuery } from '@faustjs/react/dist/mjs';


export interface BookProps {
  book: Book | Book['preview']['node'] | null | undefined;
}

export function BookComponent({ book }: BookProps) {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;

  return (
    <>
      <Header
        title={generalSettings.title}
        description={generalSettings.description}
      />

      <Head>
        <title>
          {book?.title()} - {generalSettings.title}
        </title>
      </Head>

      <Hero
        title={book?.title()}
        bgImage={book?.featuredImage?.node?.sourceUrl()}
      />

      <main className="content content-single">
        <div className="wrap">
          <div dangerouslySetInnerHTML={{ __html: book?.content() ?? '' }}/>
        </div>
      </main>

      <Footer copyrightHolder={generalSettings.title}/>
    </>
  );
}

export default function Page() {
  const { useQuery } = client;
  const { book } = useQuery();
  const router = useRouter()
  const { query } = router;
  const post = book({
    id: query.bookSlug as string,
    idType: BookIdType.SLUG,
  })

  return <BookComponent book={post}/>;
}


export interface ExtendedRequiredQuery extends RequiredQuery {
  book: (args: {
    id: string;
    idType?: BookIdType;
  }) => (Node & WithRevisions) | null | undefined;
}

async function is404Book<Context extends GetStaticPropsContext | GetServerSidePropsContext,
  >({ params }: Context, { client }: Is404Config): Promise<boolean> {
  if (!params) {
    return false;
  }
  const {
    client: { inlineResolved },
  } = client;
  const query = client.client.query as ExtendedRequiredQuery;
  let entityExists = false;
  let result: Promise<string | null | undefined> | string | null | undefined;

  try {
    result = inlineResolved(
      () =>
        query.book({
          id: params.bookSlug as string,
          idType: BookIdType.SLUG,
        })?.id,
      { refetch: true },
    );
  }
  catch (e) {
    return true;
  }

  if (result instanceof Promise) {
    entityExists = !isNil(await result);
  } else {
    entityExists = !isNil(result);
  }

  return !entityExists;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return getNextStaticProps(context, {
    Page,
    client,
    notFound: await is404Book(context, { client }),
  });
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
