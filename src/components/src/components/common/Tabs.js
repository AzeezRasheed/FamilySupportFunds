import React from "react";
import Dropdown from "../../modules/Analytics/Components/common/Dropdown";
import DateRangePicker from "./DateRangePicker";
import divider from "../../modules/Analytics/Assets/svgs/divider.svg";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DateTypeDropdown from "../../modules/Analytics/Components/common/DateTypeDropdown";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardTab } from "../../modules/Analytics/pages/actions/dashboardTabActions";

const Tabs = ({
  dataHeader,
  onChange,
  borderActive,
  customDate,
  top,
  dataContent,
  children,
  dataSection,
  analytics
}) => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state) => state.DashboardTabReducer);
  const dateOption = [
    {
      name: "Period...",
      value: "Date_Range",
    },
    {
      name: "Today",
      value: "TODAY",
    },
    {
      name: "This week",
      value: "THIS_WEEK",
    },
    {
      name: "Last 2 weeks",
      value: "LAST_2_WEEKS",
    },
    {
      name: "This month",
      value: "THIS_MONTH",
    },
  ];

  return (
    <>
      <div className={`flex ${top} flex-wrap`}>
        <div className="w-full">
          <div className="w-full flex justify-between">
            <ul
              className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
              role="tablist"
            >
              {dataHeader.map((val) => (
                <li key={val.tabIndex} className="flex ">
                  <a
                    className="flex w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setDashboardTab(val.tabIndex));
                    }}
                    data-toggle="tab"
                    href={val.link}
                    role="tablist"
                  >
                    <div className="mt-1">
                      {val.img !== "" ? (
                        <img className="mr-1" src={val.img} />
                      ) : (
                        ""
                      )}
                    </div>
                    <p
                      className={
                        "flex text-base font-normal pb-2 mr-16 " +
                        (activeTab === val.tabIndex
                          ? "text-active border-b-4 rounded-t-lg border--red"
                          : "text-default")
                      }
                      style={{
                        borderColor:
                          activeTab === val.tabIndex ? borderActive : "",
                      }}
                    >
                      {val.tabLabel}
                    </p>
                  </a>
                </li>
              ))}
            </ul>

            {dataSection && analytics && activeTab === 1 ? (
              <div className="dashboard__header">
                <div></div>
                <div className="dashboard__header__datesection">
                  <span className="dashboard__header__datesection__desc">
                    Select date
                  </span>
                  <DateTypeDropdown options={dateOption} onChange={onChange} />
                  <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                    <img src={divider} alt="" />
                  </div>

                  <div className="dashboard__header__datesection__date">
                    <DateRangePicker customDate={customDate} caseName="From" />
                    <div style={{ marginLeft: "10px" }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="bg-white mt-4 w-full rounded-md">
            <div className="py-5 flex-auto">
              {dataContent.map((val) => (
                <div key={val.id} className="tab-content tab-space">
                  <div
                    className={activeTab === val.tabIndex ? "block" : "hidden"}
                    id={val.id}
                  >
                    {children}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabs;
