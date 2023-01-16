import Head from "next/head";
import { NextPageWithLayout } from "./_app";

// imports: components
import DefaultLayout from "@/components/layout/DefaultLayout";

const NewAndPopular: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>New & Popular | Netflx</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center space-y-2">
        <h1 className="text-white text-2xl md:text-3xl font-semibold">
          New & Popular Page
        </h1>
        <p className="text-gray-300/60 text-sm md:text-base">
          under construction, please visit later
        </p>
      </div>
    </>
  );
};

export default NewAndPopular;

NewAndPopular.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
