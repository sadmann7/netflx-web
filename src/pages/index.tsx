import Head from "next/head";

// imports: components, requests, hooks, stores, and types
import Hero from "@/components/Hero";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Modal from "@/components/Modal";
import Row from "@/components/Row";
import { useAuth } from "@/contexts/AuthProvider";
import { useModalStore } from "@/stores/modal";
import { Movie } from "@/types/types";
import requests from "@/utils/requests";
import { NextPageWithLayout } from "./_app";

type HomeProps = {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
};

const Home: NextPageWithLayout<HomeProps> = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
}) => {
  const { isLoading } = useAuth();
  const modalStore = useModalStore((state) => state);
  const subscription = true;

  if (isLoading || subscription === null) return null;

  if (!subscription) return <div>plans</div>;

  return (
    <>
      <Head>
        <title>Netflx</title>
      </Head>

      <main className="mb-16">
        {modalStore.isOpen && (
          <Modal
            isOpen={modalStore.isOpen}
            toggleModal={modalStore.toggleModal}
          />
        )}
        <Hero movies={netflixOriginals} />
        <div className="w-full space-y-10">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />
          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </div>
      </main>
    </>
  );
};

export default Home;

Home.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export const getServerSideProps = async () => {
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
    },
  };
};
