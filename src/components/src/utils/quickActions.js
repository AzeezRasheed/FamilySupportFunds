import jwtDecode from "jwt-decode";
import countryConfig from "./changesConfig.json";

const countryCode = localStorage.getItem("countryCode") || "Nigeria";
const token = localStorage.getItem("userData");
let country = null;

if (token) {
  const AuthData = jwtDecode(token);
  country = AuthData?.country;
}

export const quickActionsData = [
  {
    label: "Receive Stock",
    icon: countryConfig[countryCode].quickActionRSIcon,
    borderColor: countryConfig[countryCode].quickActionRS,
    link: "/dashboard/add-details/",
  },
  {
    label: "Orders",
    icon: countryConfig[countryCode].quickActionOIcon,
    borderColor: countryConfig[countryCode].quickActionO,
    link: "/dashboard/orders-list/",
  },
  {
    label: "Empties",
    icon: countryConfig[countryCode].quickActionREIcon,
    borderColor: countryConfig[countryCode].quickActionRE,
    link: "/dashboard/return-empties/",
  },
  {
    label: "Analytics",
    icon: countryConfig[countryCode].quickActionRIcon,
    borderColor: countryConfig[countryCode].quickActionR,
    link: "/dashboard/analytics/",
  },
];

export const quickActionsInventory =
  country === "Zambia" || country === "Tanzania"
    ? [
        // {
        //   label: "Daily Stock Count",
        //   icon: dailyStock,
        //   borderColor: "transparent",
        //   link: "/dashboard/daily-stock/",
        // },
        {
          label: "Receive Stock",
          icon: countryConfig[countryCode].quickActionRSIcon,
          borderColor: "transparent",
          link: "/dashboard/add-details/",
        },
        {
          label: "Return/Receive Empties",
          icon: countryConfig[countryCode].quickActionREIcon,
          borderColor: "transparent",
          link: "/dashboard/return-empties/",
          onclick: true,
        },
        {
          label: "Return Products",
          icon: countryConfig[countryCode].quickActionRPIcon,
          borderColor: "transparent",
          link: "/dashboard/return-products/",
        },
        {
          label: "Non-ABI Products",
          icon: countryConfig[countryCode].quickActionNAPIcon,
          borderColor: "transparent",
          link: "/dashboard/other-products/",
        },
        // {
        //   label: "Receive Empties",
        //   icon: "",
        //   borderColor: "transparent",
        //   link: "",
        //   onClick: true,
        // },
      ]
    : [
        // {
        //   label: "Daily Stock Count",
        //   icon: dailyStock,
        //   borderColor: "transparent",
        //   link: "/dashboard/daily-stock/",
        // },
        {
          label: "Receive Stock",
          icon: countryConfig[countryCode].quickActionRSIcon,
          borderColor: "transparent",
          link: "/dashboard/add-details/",
        },
        {
          label: "Return/Receive Empties",
          icon: countryConfig[countryCode].quickActionREIcon,
          borderColor: "transparent",
          link: "/dashboard/return-empties/",
          onclick: true,
        },
        {
          label: "Return Products",
          icon: countryConfig[countryCode].quickActionRPIcon,
          borderColor: "transparent",
          link: "/dashboard/return-products/",
        },
        // {
        //   label: "Receive Empties",
        //   icon: "",
        //   borderColor: "transparent",
        //   link: "",
        //   onClick: true,
        // },
      ];

export const TransactionQuickActions = (code) => {
  const quickActionsTransaction = [
    {
      label: "Orders",
      icon: countryConfig[countryCode].quickActionRSIcon,
      borderColor: "transparent",
      link: `/dashboard/orders-list/${code}`,
    },
    {
      label: "Walk-in-Sales",
      icon: countryConfig[countryCode].quickActionREIcon,
      borderColor: "transparent",
      link: `/dashboard/walk-in-sales/${code}`,
    },
    {
      label: "Sales Return",
      icon: countryConfig[countryCode].quickActionRPIcon,
      borderColor: "transparent",
      link: `/dashboard/sales-return/${code}`,
    },
  ];
  return quickActionsTransaction;
};

export const VanInventoryQuickActions = (code) => {
  const quickActionsVan = [
    {
      label: "Van Replenishment",
      icon: countryConfig[countryCode].quickActionRSIcon,
      borderColor: "transparent",
      link: `/dashboard/van-replenishment/${code}`,
    },
    {
      label: "Van Transactions",
      icon: countryConfig[countryCode].quickActionREIcon,
      borderColor: "transparent",
      link: `/dashboard/van-transactions/${code}`,
    },
    {
      label: "Van Salesmen",
      icon: countryConfig[countryCode].quickActionRPIcon,
      borderColor: "transparent",
      link: `/dashboard/van-sales-men/${code}`,
    },
  ];
  return quickActionsVan;
};
