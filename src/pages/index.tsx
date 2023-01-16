import Head from "next/head";

// imports: components, requests, hooks, stores, and types
import Hero from "@/components/Hero";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import Row from "@/components/Row";
import { useModalStore } from "@/stores/modal";
import { useMovieStore } from "@/stores/movie";
import { Movie } from "@/types/globals";
import { queryFns } from "@/utils/queries";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { GetStaticProps } from "next";
import { NextPageWithLayout } from "./_app";
import MyRow from "@/components/MyRow";

const Home: NextPageWithLayout = () => {
  const trendingQuery = useQuery<{ results: Movie[] }>(
    ["trending"],
    queryFns.getTrending
  );
  const netflixOriginalsQuery = useQuery<{ results: Movie[] }>(
    ["netflixOriginals"],
    queryFns.getNetflixOriginals
  );
  const topRatedQuery = useQuery<{ results: Movie[] }>(
    ["topRated"],
    queryFns.getTopRated
  );

  const actionMoviesQuery = useQuery<{ results: Movie[] }>(
    ["actionMovies"],
    queryFns.getActionMovies
  );
  const comedyMoviesQuery = useQuery<{ results: Movie[] }>(
    ["comedyMovies"],
    queryFns.getComedyMovies
  );
  const horrorMoviesQuery = useQuery<{ results: Movie[] }>(
    ["horrorMovies"],
    queryFns.getHorrorMovies
  );
  const romanceMoviesQuery = useQuery<{ results: Movie[] }>(
    ["romanceMovies"],
    queryFns.getRomanceMovies
  );
  const documentariesQuery = useQuery<{ results: Movie[] }>(
    ["documentaries"],
    queryFns.getDocumentaries
  );

  const modalStore = useModalStore((state) => state);
  const movieStore = useMovieStore((state) => state);

  if (
    trendingQuery.isLoading ||
    topRatedQuery.isLoading ||
    netflixOriginalsQuery.isLoading ||
    actionMoviesQuery.isLoading ||
    comedyMoviesQuery.isLoading ||
    horrorMoviesQuery.isLoading ||
    romanceMoviesQuery.isLoading ||
    documentariesQuery.isLoading
  ) {
    return <Loader />;
  }

  if (
    trendingQuery.isError ||
    topRatedQuery.isError ||
    netflixOriginalsQuery.isError ||
    actionMoviesQuery.isError ||
    comedyMoviesQuery.isError ||
    horrorMoviesQuery.isError ||
    romanceMoviesQuery.isError ||
    documentariesQuery.isError
  ) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-black font-semibold text-xl md:text-3xl">
          Error in fetching movies
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Netflx</title>
      </Head>
      <main className="mb-16">
        {modalStore.isModalOpen && (
          <Modal
            isOpen={modalStore.isModalOpen}
            toggleModal={modalStore.toggleModal}
          />
        )}
        <Hero movies={netflixOriginalsQuery.data.results} />
        <div className="w-full space-y-10">
          <Row title="Trending Now" movies={trendingQuery.data.results} />
          <Row title="Top Rated" movies={topRatedQuery.data.results} />
          <Row
            title="Action Thrillers"
            movies={actionMoviesQuery.data.results}
          />
          <Row title="Comedies" movies={comedyMoviesQuery.data.results} />
          <MyRow title="My List" movies={movieStore.movies} />
          <Row title="Scary Movies" movies={horrorMoviesQuery.data.results} />
          <Row
            title="Romance Movies"
            movies={romanceMoviesQuery.data.results}
          />
          <Row title="Documentaries" movies={documentariesQuery.data.results} />
        </div>
      </main>
    </>
  );
};

export default Home;

Home.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["trending"], queryFns.getTrending);
  await queryClient.prefetchQuery(["topRated"], queryFns.getTopRated);
  await queryClient.prefetchQuery(
    ["netflixOriginals"],
    queryFns.getNetflixOriginals
  );
  await queryClient.prefetchQuery(["actionMovies"], queryFns.getActionMovies);
  await queryClient.prefetchQuery(["comedyMovies"], queryFns.getComedyMovies);
  await queryClient.prefetchQuery(["horrorMovies"], queryFns.getHorrorMovies);
  await queryClient.prefetchQuery(["romanceMovies"], queryFns.getRomanceMovies);
  await queryClient.prefetchQuery(["documentaries"], queryFns.getDocumentaries);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
