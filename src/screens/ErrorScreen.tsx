// external imports
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const ErrorScreen = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <ExclamationCircleIcon className="aspect-square w-24 text-danger md:w-28" />
      <h1 className="text-center text-2xl font-bold text-title md:text-3xl">
        Something went wrong
      </h1>
      <table>
        <thead className="text-base font-medium text-text md:text-lg">
          <tr>
            <th>Try doing these:</th>
          </tr>
        </thead>
        <tbody className="text-base font-medium text-text md:text-lg">
          <tr>
            <td>1. Spine transfer to nosegrab frontflip</td>
          </tr>
          <tr>
            <td>2. Wall flip to natas spin</td>
          </tr>
          <tr>
            <td>3. Sticker slap to manual to wallplant</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ErrorScreen;
