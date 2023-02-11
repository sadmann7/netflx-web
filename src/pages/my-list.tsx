import Head from "next/head";
import { NextPageWithLayout } from "./_app";

// external imports
import MyRow from "@/components/MyRow";
import DefaultLayout from "@/layouts/DefaultLayout";
import { useMovieStore } from "@/stores/movie";

const MyList: NextPageWithLayout = () => {
  const movieStore = useMovieStore((state) => state);

  return (
    <>
      <Head>
        <title>My List | Netflx</title>
      </Head>
      <div className="min-h-screen mt-20">
        <div className="text-black font-semibold text-xl md:text-3xl">
          {movieStore.movies.length === 0 ? (
            "No movies in your list"
          ) : (
            <div className="w-full space-y-10">
              <MyRow title="My List" movies={movieStore.movies} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyList;

MyList.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
