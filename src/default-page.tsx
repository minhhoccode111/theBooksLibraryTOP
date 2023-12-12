import {
  useLoaderData,
  Form,
  useFetcher,
  useSubmit,
  Link,
} from "react-router-dom";
import { getData, updateData } from "./methods";

export const loader = async () => {
  console.log("loader default page");
  const database = await getData();
  return { database };
};

export const action = async ({ request }) => {
  console.log("action default page");
  const data = await request.formData();
  const obj = Object.fromEntries(data);
  obj.finishedPages = Number(obj.finishedPages);
  obj.rating = Number(obj.rating);
  return updateData(obj.id, obj);
};

const DefaultPage = () => {
  const { database } = useLoaderData();

  return (
    <ul className="flex items-center gap-4 flex-wrap p-4">
      {database.map((book) => {
        return (
          <li
            key={book.id}
            className="border rounded p-4 w-72 whitespace-nowrap"
          >
            <p className="text-xl py-4 text-slate-900 overflow-x-auto">
              {book.title}
            </p>
            <div className="text-right">
              <p className="overflow-x-auto">{book.author}</p>
              <FinishedPagesAndRatingComponents book={book} />
            </div>
            <p>Id: {book.id}</p>
            <div className="flex items-center justify-between gap-4">
              <Form method="post" action="/destroy">
                <input
                  type="text"
                  readOnly
                  hidden
                  aria-hidden
                  name="id"
                  value={book.id}
                />
                <button
                  type="submit"
                  className="text-red-500 border px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                >
                  Delete
                </button>
              </Form>
              <Link
                to={`/edit/${book.id}`}
                className="text-yellow-500 border px-2 py-1 rounded hover:bg-slate-100 transition-colors"
              >
                Edit
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

function FinishedPagesAndRatingComponents({ book }) {
  const submit = useSubmit();
  const fetcher = useFetcher();
  let finishedPages = book.finishedPages;
  let rating = book.rating;
  if (fetcher.formData) {
    finishedPages = fetcher.formData.get("finishedPages");
    rating = fetcher.formData.get("rating");
  }

  return (
    <fetcher.Form method="post" className="flex flex-col gap-2 p-1">
      <div>
        <label>
          <input
            defaultValue={finishedPages}
            type="number"
            min={0}
            max={book.pages}
            className="text-right max-w-[100px]"
            name="finishedPages"
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          /{book.pages} pages
        </label>
      </div>
      <div>
        <label>
          <input
            type="number"
            min={0}
            max={5}
            className={
              "text-right max-w-[100px]" +
              " " +
              (book.rating < 2
                ? "text-red-500"
                : book.rating < 4
                  ? "text-yellow-500"
                  : "text-green-500")
            }
            defaultValue={rating}
            name="rating"
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          /5 rating
        </label>
      </div>
      <input
        type="text"
        hidden
        aria-hidden
        readOnly
        name="id"
        value={book.id}
        placeholder="this input is used to provide book id to formData in action"
      />
    </fetcher.Form>
  );
}

export default DefaultPage;
