import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root, { action as rootAction } from "./root";
import ErrorPage from "./error-page";
import Add from "./add";
import DefaultPage, {
  loader as defaultLoader,
  action as defaultAction,
} from "./default-page";
import Edit from "./edit";
import { action as deleteAction } from "./delete";

const Router: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      action: rootAction,
      children: [
        {
          index: true,
          element: <DefaultPage />,
          loader: defaultLoader,
          action: defaultAction,
        },
        {
          path: "add",
          element: <Add />,
        },
        {
          path: "edit",
          element: <Edit />,
        },
        {
          path: "destroy",
          action: deleteAction,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
