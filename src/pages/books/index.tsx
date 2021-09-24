import { getNextStaticProps } from '@faustjs/next';
import { client } from 'client';
import { Footer, Header, Pagination } from 'components';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Heading from '../../components/Heading';
import Link from 'next/link';

const POSTS_PER_PAGE = 6;

export default function Page() {
  const { query = {} } = useRouter();
  const { bookSlug, postCursor } = query;
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;
  const isBefore = bookSlug === 'before';
  const posts = useQuery().books({
    after: !isBefore ? (postCursor as string) : undefined,
    before: isBefore ? (postCursor as string) : undefined,
    first: !isBefore ? POSTS_PER_PAGE : undefined,
    last: isBefore ? POSTS_PER_PAGE : undefined,
  });

  if (useQuery().$state.isLoading) {
    return null;
  }

  return (
    <>
      <Header
        title={generalSettings.title}
        description={generalSettings.description}
      />

      <Head>
        <title>
          {generalSettings.title} - {generalSettings.description}
        </title>
      </Head>

      <main className="content content-index">
        <div className="wrap">
          <h2>Books</h2>
          {posts.nodes.map((post) => (
            <article key={post.id}>
              <Heading level="h3" >
                <Link href={`/books/${post.slug}`}>
                  <a>{post.title()}</a>
                </Link>
                <div
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: post.excerpt() ?? '' }}
                />
              </Heading>
            </article>
          ))}
        </div>

        <Pagination pageInfo={posts.pageInfo} basePath="/books"/>
      </main>

      <Footer copyrightHolder={generalSettings.title}/>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return getNextStaticProps(context, {
    Page,
    client,
  });
}
