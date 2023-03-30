import { ReactComponent as HomeIcon } from "../assets/svg/home-icon.svg";
import homeIcon from "../assets/svg/home-icon.svg";
import { ReactComponent as InventoryIcon } from "../assets/svg/inventoryIcon.svg";
import { ReactComponent as TransactionIcon } from "../assets/svg/transactionIcon.svg";
import { ReactComponent as VanWarehouseIcon } from "../assets/svg/vanWarehouseIcon.svg";
import { ReactComponent as CustomersIcon } from "../assets/svg/customersIcon.svg";
import { ReactComponent as ReportIcon } from "../assets/svg/reportIcon.svg";
import { ReactComponent as NotificationIcon } from "../assets/svg/notificationIcon.svg";
import { ReactComponent as PricingIcon } from "../assets/svg/pricingIcon.svg";
import { ReactComponent as SummaryIcon } from "../assets/svg/summaryIcon.svg";
import { ReactComponent as DistributorIcon } from "../assets/svg/distributor-icon.svg";
import {
  RiStockFill,
  RiNotification4Line,
  RiBarChartFill,
} from "react-icons/ri";
import { useTranslation } from "react-i18next";
import countryConfig from "./changesConfig.json";

const countryCode = localStorage.getItem("countryCode");

export const KpoRoutes = (code, country) => {
  const { t } = useTranslation();

  const routes = [
    {
      label: "Home",
      link: `/dashboard/overview/${code}`,
      // icon: homeIcon,
      icon: <HomeIcon />,
    },
    {
      label: `${country === "Tanzania" ? "Stock" : "Inventory"}`,
      link: `/dashboard/inventory/${code}`,
      icon: <InventoryIcon />,
    },
    {
      label: "Transactions",
      link: `/dashboard/transactions/${code}`,
      icon: <TransactionIcon />,
    },
    {
      label: "Van Warehouse",
      link: `/dashboard/van-inventory/${code}`,
      icon: <VanWarehouseIcon />,
    },
    {
      label: "Customers",
      link: `/dashboard/customers/${code}`,
      icon: <CustomersIcon />,
    },
    // {
    //   label: "Reports",
    //   link: `/dashboard/reports/${code}`,
    //   icon: <ReportIcon />,
    // },
    {
      label: "Analytics",
      link: `/dashboard/analytics/${code}`,
      icon: <ReportIcon />
    },
    // {
    //   label: "Notification",
    //   link: `/dashboard/notifications/${code}`,
    //   icon: AiFillSetting
    // },
  ];
  return routes;
};

export const AdminRoutes = [
  {
    label: "Distributors",
    link: "/admin-dashboard",
    icon: <DistributorIcon />,
  },
  {
    label: "Notifications",
    link: "/dashboard/admin-notifications",
    icon: <NotificationIcon />,
  },
  {
    label: "Reports",
    link: "/admin-dashboard/reports",
    icon: <ReportIcon />,
  },
  {
    label: "Pricings",
    link: "/distributor/pricings",
    icon: <PricingIcon />,
  },
  {
    label: "Customers",
    link: `/admin-dashboard/customers`,
    icon: <CustomersIcon />,
  },
  // {
  //   label: "Back Office",
  //   link: "/distributor/backoffice",
  //   icon: MdPeople,
  // },
  // {
  //   label: "Van Salesmen",
  //   link: "/distributor/drivers",
  //   icon: MdPeople,
  // },
  {
    label: "Users",
    link: "/admin-dashboard/users",
    icon: <CustomersIcon />,
  },
  // {
  //   label: "Settings",
  //   link: "#",
  //   icon: AiFillSetting
  // },
];

export const MinAdminRoutes = [
  {
    label: "Distributors",
    link: "/min-admin-dashboard",
    icon: <DistributorIcon />,
  },
  {
    label: "Reports",
    link: "/min-admin-dashboard/reports",
    icon: <ReportIcon />,
  },
  {
    label: "Customers",
    link: `/min-admin-dashboard/customers`,
    icon: <CustomersIcon />,
  },
  {
    label: "Summary",
    link: "/min-admin-dashboard/summary",
    icon: <SummaryIcon />,
  },
];

export const DistributorRoutes = (code) => {
  const distributorLink = [
    {
      label: "Overview",
      link: `/admin-distributor/${code}`,
    },
    {
      label: "Customers",
      link: `/distributor/customers/${code}`,
    },
    {
      label: "Users",
      link: `/distributor/users/${code}`,
    },
    {
      label: "Reports",
      link: `/distributor/reports/${code}`,
    },
    {
      label: "Orders",
      link: `/distributor/orders/${code}`,
    },
    // {
    //   label: "Drop points",
    //   link: `/distributor/drop-point/${code}`,
    // },
  ];
  return distributorLink;
};
