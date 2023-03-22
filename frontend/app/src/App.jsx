import { useEffect, useMemo, useState, Fragment, useRef } from "react";
import { useTable, usePagination } from "react-table";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const API_ADDR = "http://127.0.0.1:8000/api";

function App() {
  const [dataRaw, setDataRaw] = useState([]);
  const [dataRawCount, setDataRawCount] = useState(null);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isModalAddRecord, setIsModalAddRecord] = useState(null);

  const [error, setError] = useState("");

  const formRef = useRef();

  const [record_id, set_record_id] = useState(null);
  const [country, set_country] = useState(null);
  const [year, set_year] = useState(null);
  const [continent, set_continent] = useState(null);
  const [least_developed, set_least_developed] = useState(null);
  const [life_expectancy, set_life_expectancy] = useState(null);
  const [population, set_population] = useState(null);
  const [co2_emissions, set_co2_emissions] = useState(null);
  const [health_expenditure, set_health_expenditure] = useState(null);
  const [electric_power_consumption, set_electric_power_consumption] =
    useState(null);
  const [forest_area, set_forest_area] = useState(null);
  const [gdp_per_capita, set_gdp_per_capita] = useState(null);
  const [individuals_using_the_internet, set_individuals_using_the_internet] =
    useState(null);
  const [military_expenditure, set_military_expenditure] = useState(null);
  const [
    people_practicing_open_defecation,
    set_people_practicing_open_defecation,
  ] = useState(null);
  const [
    people_using_at_least_basic_drinking_water_services,
    set_people_using_at_least_basic_drinking_water_services,
  ] = useState(null);
  const [obesity_among_adults, set_obesity_among_adults] = useState(null);
  const [beer_consumption_per_capita, set_beer_consumption_per_capita] =
    useState(null);

  const [dataBeer, setDataBeer] = useState(null);

  const LABELS = [
    ["id", "str"],
    ["country", "str"],
    ["year", "int"],
    ["continent", "str"],
    ["least_developed", "bool"],
    ["life_expectancy", "float"],
    ["population", "int"],
    ["co2_emissions", "float"],
    ["health_expenditure", "float"],
    ["electric_power_consumption", "float"],
    ["forest_area", "float"],
    ["gdp_per_capita", "float"],
    ["individuals_using_the_internet", "float"],
    ["military_expenditure", "float"],
    ["people_practicing_open_defecation", "float"],
    ["people_using_at_least_basic_drinking_water_services", "float"],
    ["obesity_among_adults", "float"],
    ["beer_consumption_per_capita", "float"],
  ];

  const HEADERS = LABELS.map((L) => L[0]);

  const HEADERS_TYPES = LABELS.map((L) => L[1]);

  // const toggleModal = () => {
  //   setModalVisible(!modalVisible);
  //   setTimeout(inputsValid, 100);
  // }

  const handleReset = () => {
    setError("");
    set_country(null);
    set_year(null);
    set_continent(null);
    set_least_developed(null);
    set_life_expectancy(null);
    set_population(null);
    set_co2_emissions(null);
    set_health_expenditure(null);
    set_electric_power_consumption(null);
    set_forest_area(null);
    set_gdp_per_capita(null);
    set_individuals_using_the_internet(null);
    set_military_expenditure(null);
    set_people_practicing_open_defecation(null);
    set_people_using_at_least_basic_drinking_water_services(null);
    set_obesity_among_adults(null);
    set_beer_consumption_per_capita(null);
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();

    const body = {};

    HEADERS.filter((H) => H !== "id").forEach((H) => (body[H] = eval(H)));
    body.least_developed = body.least_developed ?? false;

    if (!inputsValid()) {
      return;
    }

    try {
      const res = await fetch(`${API_ADDR}/people`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setModalVisible(false);
        fetchData();
        setError("");
        handleReset();
        return;
      }
    } catch (err) {
      setModalVisible(false);
      console.log(err);
    }
  };

  const handleEditRecord = async (e) => {
    e.preventDefault();

    const body = {};

    HEADERS.filter((H) => H !== "id").forEach((H) => (body[H] = eval(H)));
    body.least_developed = body.least_developed ?? false;
    body.id = record_id;

    if (!inputsValid()) {
      return;
    }

    try {
      const res = await fetch(`${API_ADDR}/people`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setModalVisible(false);
        fetchData();
        setError("");
        handleReset();
        return;
      }
    } catch (err) {
      setModalVisible(false);
      console.log(err);
    }
  };

  const handleFocus = (e) => {
    e.target.classList.remove("border-2", "border-red-500");
  };

  const inputsValid = () => {
    if (!formRef.current) {
      setError("");
      return;
    }
    for (let i = 0; i < formRef.current.length; i++) {
      if (
        formRef.current[i].id.startsWith("H") &&
        formRef.current[i].validity.badInput
      ) {
        const header = formRef.current[i].name;
        let errorMsg = `Bad input at ${header
          .split("_")
          .map((word) => word[0].toLocaleUpperCase() + word.substring(1))
          .join(" ")} - please provide valid `;
        const type = LABELS.find(([Header]) => Header === header)[1];
        if (type === "float") {
          errorMsg += "number";
        } else if (type === "int") {
          errorMsg += "integer number";
        }
        setError(errorMsg);
        formRef.current[i].classList.add("border-2", "border-red-500");
        return false;
      } else {
        setError("");
        formRef.current[i].classList.remove("border-2", "border-red-500");
      }
    }
    return true;
  };

  const handleEdit = (row) => {
    set_record_id(row.id === "---" ? null : row.id);
    set_country(row.country === "---" ? null : row.country);
    set_year(row.year === "---" ? null : row.year);
    set_continent(row.continent === "---" ? null : row.continent);
    set_least_developed(row.least_developed === "true");
    set_life_expectancy(
      row.life_expectancy === "---" ? null : row.life_expectancy
    );
    set_population(row.population === "---" ? null : row.population);
    set_co2_emissions(row.co2_emissions === "---" ? null : row.co2_emissions);
    set_health_expenditure(
      row.health_expenditure === "---" ? null : row.health_expenditure
    );
    set_electric_power_consumption(
      row.electric_power_consumption === "---"
        ? null
        : row.electric_power_consumption
    );
    set_forest_area(row.forest_area === "---" ? null : row.forest_area);
    set_gdp_per_capita(
      row.gdp_per_capita === "---" ? null : row.gdp_per_capita
    );
    set_individuals_using_the_internet(
      row.individuals_using_the_internet === "---"
        ? null
        : row.individuals_using_the_internet
    );
    set_military_expenditure(
      row.military_expenditure === "---" ? null : row.military_expenditure
    );
    set_people_practicing_open_defecation(
      row.people_practicing_open_defecation === "---"
        ? null
        : row.people_practicing_open_defecation
    );
    set_people_using_at_least_basic_drinking_water_services(
      row.people_using_at_least_basic_drinking_water_services === "---"
        ? null
        : row.people_using_at_least_basic_drinking_water_services
    );
    set_obesity_among_adults(
      row.obesity_among_adults === "---" ? null : row.obesity_among_adults
    );
    set_beer_consumption_per_capita(
      row.beer_consumption_per_capita === "---"
        ? null
        : row.beer_consumption_per_capita
    );
    setModalVisible(true);
    setIsModalAddRecord(false);
  };

  const fetchData = async () => {
    try {
      let res = await fetch(
        `${API_ADDR}/people` + (search ? `?country=${search}` : "")
      );
      if (res) {
        res = await res.json();
        // setDataRaw(res?.items.filter((_, id) => id < 100));
        setDataRaw(res?.items);
        setDataRawCount(res?.results);
      }

      res = await fetch(`${API_ADDR}/people/beer_is_life`);
      if (res) {
        res = await res.json();
        setDataBeer(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const data = useMemo(
    () =>
      dataRaw.map((item) =>
        Object.fromEntries(
          HEADERS.map((H, id) => {
            if (item[H] === null) {
              return [H, "---"];
            }
            if (HEADERS_TYPES[id] === "float") {
              return [H, item[H].toFixed(2)];
            }
            if (HEADERS_TYPES[id] === "bool") {
              return [H, item[H].toString()];
            }

            return [H, item[H]];
          })
        )
      ),
    [dataRaw]
  );

  const columns = useMemo(
    () =>
      HEADERS.map((name) => ({
        Header: name
          .split("_")
          .map((word) => word[0].toLocaleUpperCase() + word.substring(1))
          .join(" "),
        accessor: name,
      })),
    []
  );

  let {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
    pageIndex = 0;
  }, [search]);

  return (
    <div className="App font-mont">
      {/* modal */}
      {modalVisible && (
        <div className="fixed w-full h-full overflow-scroll">
          <div className="fixed w-full h-full bg-black opacity-40"></div>
          <div className="grid place-items-center mt-16">
            <div className="w-1/2 bg-white z-10 rounded-xl p-8 shadow-md shadow-gray-800">
              <div className="flex flex-row justify-between mb-6">
                {isModalAddRecord ? (
                  <p className="text-3xl">New Record</p>
                ) : (
                  <p className="text-3xl">Edit Record</p>
                )}
                <button onClick={() => setModalVisible(false)}>X</button>
              </div>

              <form ref={formRef} onSubmit={handleAddRecord}>
                <div className="grid grid-cols-2 gap-2">
                  {!isModalAddRecord && (
                    <Fragment>
                      <span>Id</span>
                      <span className="text-gray-400 mb-2">{record_id}</span>
                    </Fragment>
                  )}

                  {HEADERS.map((H, id) => {
                    if (H === "id") return <Fragment key={id}></Fragment>;

                    const type = HEADERS_TYPES[id];

                    // type === str
                    let inputElement = (
                      <input
                        id={`H${id}`}
                        onFocus={handleFocus}
                        type="text"
                        name={H}
                        value={eval(H) ?? ""}
                        onChange={(a) => eval(`set_${H}('${a.target.value}')`)}
                        className="border border-black h-8 px-2"
                      />
                    );

                    if (type === "int") {
                      inputElement = (
                        <input
                          id={`H${id}`}
                          onFocus={handleFocus}
                          type="number"
                          min="0"
                          step="1"
                          name={H}
                          value={eval(H) ?? ""}
                          onChange={(a) => eval(`set_${H}(${a.target.value})`)}
                          className="border border-black h-8 px-2"
                        />
                      );
                    } else if (type === "float") {
                      inputElement = (
                        <input
                          id={`H${id}`}
                          onFocus={handleFocus}
                          type="number"
                          min="0"
                          step="0.0001"
                          name={H}
                          value={eval(H) ?? ""}
                          onChange={(a) => eval(`set_${H}(${a.target.value})`)}
                          className="border border-black h-8 px-2"
                        />
                      );
                    } else if (type === "bool") {
                      inputElement = (
                        <input
                          id={`H${id}`}
                          onFocus={handleFocus}
                          type="checkbox"
                          name={H}
                          checked={eval(H) ?? false}
                          onChange={(a) =>
                            eval(`set_${H}(${a.target.checked})`)
                          }
                          className="h-6 w-6 my-1 justify-self-start"
                        />
                      );
                    }

                    return (
                      <Fragment key={id}>
                        <label htmlFor={`H${id}`}>
                          {H.split("_")
                            .map(
                              (word) =>
                                word[0].toLocaleUpperCase() + word.substring(1)
                            )
                            .join(" ")}
                        </label>
                        {inputElement}
                      </Fragment>
                    );
                  })}
                </div>
                {error && <p className="text-red-500 mt-4">ERROR: {error}</p>}
                <div className="flex flex-row justify-between mt-4">
                  <div className="flex flex-row gap-3">
                    <button
                      onClick={() => {
                        setModalVisible(false);
                        setError("");
                      }}
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-xl text-white w-32"
                    >
                      Cancel
                    </button>
                    {isModalAddRecord && (
                      <button
                        onClick={handleReset}
                        type="reset"
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white w-32"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  {isModalAddRecord ? (
                    <button
                      onClick={handleAddRecord}
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl text-white w-32"
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      onClick={handleEditRecord}
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl text-white w-32"
                    >
                      Edit record
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* title */}
      <div className="flex flex-col items-center py-10 gap-4 mx-8">
        <p className="font-bold text-4xl text-center">
          Life Expectancy 2000-2015
        </p>
        <a
          className="text-blue-500 hover:underline"
          href="https://www.kaggle.com/datasets/vrec99/life-expectancy-2000-2015"
        >
          Link for data source
        </a>
      </div>

      {/* search */}
      <div className="flex flex-row gap-4 mx-8">
        <div className="flex flex-row gap-4 items-center">
          <label htmlFor="search">Search by country name:</label>
          <input
            className="border border-black px-2 py-1 w-[400px]"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            setModalVisible(true);
            setIsModalAddRecord(true);
            handleReset();
          }}
          className="text-white bg-gray-500 rounded-xl px-4 py-1 hover:bg-gray-600"
        >
          Add record
        </button>
      </div>

      {/* table */}
      <div className="w-full overflow-x-scroll px-8 mt-4">
        <table {...getTableProps()} className="table-auto w-[2000px]">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th className="border border-black px-2 py-1">Actions</th>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="border border-black px-2 py-1"
                  >
                    {column.render("Header")}
                  </th>
                ))}
                <th className="border border-black px-2 py-1">Actions</th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  <td className="border border-black px-2 py-1 whitespace-nowrap">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEdit(row.original)}
                    >
                      Edit
                    </button>
                  </td>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="border border-black px-2 py-1 whitespace-nowrap"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                  <td className="border border-black px-2 py-1 whitespace-nowrap">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEdit(row.original)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="pagination my-4 mx-8">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
            className="bg-gray-200 px-2 h-6"
            min={1}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          className="h-6"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      {/* charts */}
      <div className="flex flex-col items-center py-10 gap-4 mx-8">
        <p className="font-bold text-4xl text-center">Statistics</p>
      </div>
      {dataBeer && (
        <div className="w-[400px] h-[400px] m-10">
          <Pie
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Life expectancy according on the alcohol consumed per capita",
                },
              },
            }}
            data={{
              labels: ["Got longer", "Got shorter"],
              datasets: [
                {
                  data: [
                    dataBeer.results,
                    dataBeer.country_count - dataBeer.results,
                  ],
                  backgroundColor: [
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                  ],
                  borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 159, 64, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
