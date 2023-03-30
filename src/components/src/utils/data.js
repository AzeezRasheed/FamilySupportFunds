import trophyLager from "../assets/svg/trophyLager.svg";
import trophyLagerCan from "../assets/svg/trophyLagerCan.svg";
import castleLite from "../assets/svg/castleLite.svg";
import trophyStout from "../assets/svg/trophyStout.svg";
import eagleLager from "../assets/svg/eagleLager.svg";
import eagleStout from "../assets/svg/eagleStout.svg";
import heroLagerCan from "../assets/svg/heroLagerCan.svg";
import grandMalt from "../assets/svg/grandMalt.svg";
import infoGreen from "../assets/svg/info.svg";
import infoRed from "../assets/svg/info-red.svg";

export const NotificationData = [
  {
    details: "New stock 103828 has been sent from Gateway Plant.",
    date: "Today",
    time: "9:03AM",
  },
  {
    details: "New stock 103828 has been sent from Isolo Plant.",
    date: "22-04-2021",
    time: "8:45AM",
  },
  {
    details: "New stock 103877 has been sent from Ajah Plant.",
    date: "27-04-2021",
    time: "3:15PM",
  },
  {
    details: "New stock 103728 has been sent from Festac Plant.",
    date: "31-04-2021",
    time: "2:30PM",
  },
  {
    details: "New stock 1045528 has been sent from Ikorodu Plant.",
    date: "01-05-2021",
    time: "3:30PM",
  },
];

export const notificationTabHeaderData = [
  {
    tabLabel: "All Notifications",
    tabIndex: 1,
    link: "#link1",
    img: "",
  },
  {
    tabLabel: "New Order Alerts",
    tabIndex: 2,
    link: "#link2",
    img: "",
  },
  {
    tabLabel: "Out-of-Stock Alerts",
    tabIndex: 3,
    link: "#link3",
    img: "",
  },
];

export const adminNotificationTabHeaderData = [
  {
    tabLabel: "All Notifications",
    tabIndex: 1,
    link: "#link1",
    img: "",
  },
  // {
  // 	tabLabel: 'KPOs',
  // 	tabIndex: 2,
  // 	link: '#link2',
  // 	img: ''
  // },
  // {
  // 	tabLabel: 'KPO Supervisors',
  // 	tabIndex: 3,
  // 	link: '#link3',
  // 	img: ''
  // },
  // {
  // 	tabLabel: 'Account Owners',
  // 	tabIndex: 4,
  // 	link: '#link4',
  // 	img: ''
  // }
];

export const dashboardTabHeaderData = [
  {
    tabLabel: "Dashboard",
    tabIndex: 1,
    link: "#link1",
    img: "",
  },
  {
    tabLabel: "Report",
    tabIndex: 2,
    link: "#link2",
    img: "",
  },
];

export const dashboardTableContent = [
  {
    tabIndex: 1,
    id: "link1",
  },
  {
    tabIndex: 2,
    id: "link2",
  },
];

export const notificationSubTabHeaderData = [
  {
    tabLabel: "All Alerts",
    tabIndex: 1,
    link: "#link1",
  },
  //   {
  //     tabLabel: "Unread",
  //     tabIndex: 2,
  //     link: "#link2",
  //   },
  //   {
  //     tabLabel: "Read",
  //     tabIndex: 3,
  //     link: "#link3",
  //   },
];

export const adminNotificationSubTabHeaderData = [
  {
    tabLabel: "All Alerts",
    tabIndex: 1,
    link: "#link1",
  },
  // {
  // 	tabLabel: 'Awaiting action',
  // 	tabIndex: 2,
  // 	link: '#link2'
  // },
  // {
  // 	tabLabel: 'Unread',
  // 	tabIndex: 3,
  // 	link: '#link3'
  // },
  // {
  // 	tabLabel: 'Read',
  // 	tabIndex: 4,
  // 	link: '#link4'
  // },
  // {
  // 	tabLabel: 'Newest to Oldest',
  // 	tabIndex: 5,
  // 	link: '#link5'
  // }
];

export const notificationTableContent = [
  {
    tabIndex: 1,
    id: "link1",
  },
  {
    tabIndex: 2,
    id: "link2",
  },
  {
    tabIndex: 3,
    id: "link3",
  },
];

export const inventoryData = [
  {
    id: 1,
    name: "Hero Lager",
    type: "300 ml × 12 (CAN)",
    label: "Liquid",
    quantity: 10000,
    labelColor: "#D86217",
    status: "Available",
    statusColor: "#0DD83A",
    statusImage: infoGreen,
    image: heroLagerCan,
  },
  {
    id: 2,
    name: "Trophy Stout",
    type: "600 ml × 12 (RB)",
    label: "Empty",
    quantity: 2000,
    labelColor: "#F49C00",
    status: "Out of stock",
    statusColor: "#D82C0D",
    statusImage: infoRed,
    image: trophyStout,
  },
  {
    id: 3,
    name: "Trophy Lager",
    type: "600 ml × 12 (RB)",
    label: "Empty",
    quantity: 20000,
    labelColor: "#F49C00",
    status: "Available",
    statusColor: "#0DD83A",
    statusImage: infoGreen,
    image: trophyLager,
  },
  {
    id: 4,
    name: "Trophy Lager",
    type: "500 ml × 24 (CAN)",
    label: "Liquid",
    quantity: 5000,
    labelColor: "#D86217",
    status: "Out of stock",
    statusColor: "#D82C0D",
    statusImage: infoRed,
    image: trophyLagerCan,
  },
  {
    id: 5,
    name: "Eagle Stout",
    type: "600 ml × 12 (RB)",
    label: "Liquid",
    quantity: 7000,
    labelColor: "#D86217",
    status: "Available",
    statusColor: "#0DD83A",
    statusImage: infoGreen,
    image: eagleStout,
  },
  {
    id: 6,
    name: "Eagle Lager",
    type: "600 ml × 12 (RB)",
    label: "Empty",
    quantity: 12000,
    labelColor: "#F49C00",
    status: "Out of stock",
    statusColor: "#D82C0D",
    statusImage: infoRed,
    image: eagleLager,
  },
  {
    id: 7,
    name: "Castle Lite",
    type: "375 ml × 12 (RB)",
    label: "Liquid",
    quantity: 10000,
    labelColor: "#D86217",
    status: "Available",
    statusColor: "#0DD83A",
    statusImage: infoGreen,
    image: castleLite,
  },
  {
    id: 8,
    name: "Grand Malt",
    type: "330 ml × 24 (PET)",
    label: "Empty",
    quantity: 14000,
    labelColor: "#F49C00",
    status: "Out of stock",
    statusColor: "#D82C0D",
    statusImage: infoRed,
    image: grandMalt,
  },
];

export const warehouses = [
  {
    name: "All Warehouse",
    value: "all",
  },
  {
    name: "Munshin Mega warehouse",
    value: "Munshi",
  },
  {
    name: "Isolo Drop point",
    value: "Isolo",
  },
  {
    name: "Alh Musa Drop Point",
    value: "Alhaji",
  },
  {
    name: "Ladipo Drop Point",
    value: "Ladipo",
  },
];

export const orderData = [
  {
    id: 1,
    name: "Hero Lager",
    type: "300 ml × 12 (CAN)",
    cases: "200",
    image: heroLagerCan,
  },
  {
    id: 2,
    name: "Trophy Stout",
    type: "600 ml × 12 (RB)",
    cases: "1250",
    image: trophyStout,
  },
  {
    id: 3,
    name: "Trophy Lager",
    type: "600 ml × 12 (RB)",
    cases: "1200",
    quantity: 20000,
    image: trophyLager,
  },
  {
    id: 4,
    name: "Trophy Lager",
    type: "500 ml × 24 (CAN)",
    cases: "300",
    image: trophyLagerCan,
  },
  {
    id: 5,
    name: "Eagle Stout",
    type: "600 ml × 12 (RB)",
    cases: "1000",
    image: eagleStout,
  },
];

export const AdminDistributorList = [
  {
    id: 1,
    distributionCode: "LAG/SOU/002",
    distributorName: "KMS Nigeria Lmited",
    location: "Lagos South, LAGOS",
    status: "Active",
    totalOrder: "402",
    totalSales: "10,040,888.03",
  },
  {
    id: 2,
    distributionCode: "LAG/SOU/002",
    distributorName: "KMS Nigeria Lmited",
    location: "Lagos South, LAGOS",
    status: "Inactive",
    totalOrder: "402",
    totalSales: "10,040,888.03",
  },
  {
    id: 3,
    distributionCode: "LAG/SOU/002",
    distributorName: "KMS Nigeria Lmited",
    location: "Lagos South, LAGOS",
    status: "Active",
    totalOrder: "402",
    totalSales: "10,040,888.03",
  },
  {
    id: 4,
    distributionCode: "LAG/SOU/002",
    distributorName: "KMS Nigeria Lmited",
    location: "Lagos South, LAGOS",
    status: "Active",
    totalOrder: "402",
    totalSales: "10,040,888.03",
  },
  {
    id: 5,
    distributionCode: "LAG/SOU/002",
    distributorName: "KMS Nigeria Lmited",
    location: "Lagos South, LAGOS",
    status: "Inactive",
    totalOrder: "402",
    totalSales: "10,040,888.03",
  },
  {
    id: 6,
    distributionCode: "LAG/SOU/002",
    distributorName: "KMS Nigeria Lmited",
    location: "Lagos South, LAGOS",
    status: "Active",
    totalOrder: "402",
    totalSales: "10,040,888.03",
  },
  {
    id: 7,
    distributionCode: "LAG/SOU/002",
    distributorName: "KMS Nigeria Lmited",
    location: "Lagos South, LAGOS",
    status: "Active",
    totalOrder: "402",
    totalSales: "10,040,888.03",
  },
  {
    id: 8,
    distributionCode: "LAG/SOU/002",
    distributorName: "KMS Nigeria Lmited",
    location: "Lagos South, LAGOS",
    status: "Active",
    totalOrder: "402",
    totalSales: "10,040,888.03",
  },
  {
    id: 9,
    distributionCode: "LAG/SOU/002",
    distributorName: "KMS Nigeria Lmited",
    location: "Lagos South, LAGOS",
    status: "Inactive",
    totalOrder: "402",
    totalSales: "10,040,888.03",
  },
  {
    id: 10,
    distributionCode: "LAG/SOU/002",
    distributorName: "KMS Nigeria Lmited",
    location: "Lagos South, LAGOS",
    status: "Active",
    totalOrder: "402",
    totalSales: "10,040,888.03",
  },
];

// export const CustomerTableTh = [
// 	{
// 		name: 'All Warehouse',
// 		value: 'all'
// 	},
// 	{
// 		name: 'Munshin Mega warehouse',
// 		value: 'Munshi'
// 	},
// 	{
// 		name: 'Isolo Drop point',
// 		value: 'Isolo'
// 	},
// 	{
// 		name: 'Alh Musa Drop Point',
// 		value: 'Alhaji'
// 	},
// 	{
// 		name: 'Ladipo Drop Point',
// 		value: 'Ladipo'
// 	}
// ]

// export const OverviewTableTh = [
// 	{
// 		name: 'Order Number'
// 	},
// 	{
// 		name: 'Date',
// 	},
// 	{
// 		name: 'Customer Name',
// 	},
// 	{
// 		name: 'Route Name',
// 	},
// 	{
// 		name: 'Delivery Driver',
// 	},
// 	{
// 		name: 'Status',
// 	},
// 	{
// 		name: 'Products',
// 	},
// 	{
// 		name: 'Amount',
// 	}
// ]

export const CustomerList = [
  {
    id: 1,
    customerCode: "LAG/SOU/002",
    customerName: "Olat Store Limited",
    location: "Lagos South, LAGOS",
    status: "Active",
    lastOrder: "2021-08-18",
    totalOrder: "402",
    amountSpent: "₦10,040,888.03",
  },
  {
    id: 2,
    customerCode: "LAG/SOU/002",
    customerName: "Olat Store Limited",
    location: "Lagos South, LAGOS",
    status: "Inactive",
    lastOrder: "2021-05-04",
    totalOrder: "402",
    amountSpent: "₦10,040,888.03",
  },
  {
    id: 3,
    customerCode: "LAG/SOU/002",
    customerName: "Olat Store Limited",
    location: "Lagos South, LAGOS",
    status: "Active",
    lastOrder: "2021-02-15",
    totalOrder: "402",
    amountSpent: "₦10,040,888.03",
  },
  {
    id: 4,
    customerCode: "LAG/SOU/002",
    customerName: "Olat Store Limited",
    location: "Lagos South, LAGOS",
    status: "Active",
    lastOrder: "2021-12-09",
    totalOrder: "402",
    amountSpent: "₦10,040,888.03",
  },
  {
    id: 5,
    customerCode: "LAG/SOU/002",
    customerName: "Olat Store Limited",
    location: "Lagos South, LAGOS",
    status: "Inactive",
    lastOrder: "2021-08-11",
    totalOrder: "402",
    amountSpent: "₦10,040,888.03",
  },
  {
    id: 6,
    customerCode: "LAG/SOU/002",
    customerName: "Olat Store Limited",
    location: "Lagos South, LAGOS",
    status: "Active",
    lastOrder: "2021-05-23",
    totalOrder: "402",
    amountSpent: "₦10,040,888.03",
  },
  {
    id: 7,
    customerCode: "LAG/SOU/002",
    customerName: "Olat Store Limited",
    location: "Lagos South, LAGOS",
    status: "Inactive",
    lastOrder: "2021-03-09",
    totalOrder: "402",
    amountSpent: "₦10,040,888.03",
  },
  {
    id: 8,
    customerCode: "LAG/SOU/002",
    customerName: "Olat Store Limited",
    location: "Lagos South, LAGOS",
    status: "Active",
    lastOrder: "2021-09-14",
    totalOrder: "402",
    amountSpent: "₦10,040,888.03",
  },
  {
    id: 9,
    customerCode: "LAG/SOU/002",
    customerName: "Olat Store Limited",
    location: "Lagos South, LAGOS",
    status: "Active",
    lastOrder: "2021-04-15",
    totalOrder: "402",
    amountSpent: "₦10,040,888.03",
  },
  {
    id: 10,
    customerCode: "LAG/SOU/002",
    customerName: "Olat Store Limited",
    location: "Lagos South, LAGOS",
    status: "Active",
    lastOrder: "2021-03-16",
    totalOrder: "402",
    amountSpent: "₦10,040,888.03",
  },
];

export const VMS = [
  {
    id: 1,
    name: "Gabriel Ramos",
    status: "Active",
  },
  {
    id: 2,
    name: "Essie Graham",
    status: "Active",
  },
  {
    id: 3,
    name: "Keith Watkins",
    status: "Active",
  },
  {
    id: 4,
    name: "Mario Burns",
    status: "Active",
  },
  {
    id: 5,
    name: "Shawn Walton",
    status: "Active",
  },
  {
    id: 6,
    name: "Peter Bates",
    status: "Active",
  },
];

export const OrdersList = [
  {
    id: 1,
    orderNumber: "196125",
    date: "30-04-2021",
    routeName: "Ebzopoc",
    deliveryDriver: "Nathan Wallace",
    status: "Completed",
    products: "7",
    amount: "₦10,040,888.03",
  },
  {
    id: 2,
    orderNumber: "106966",
    date: "01-09-2021",
    routeName: "Hurouk",
    deliveryDriver: "Georgia Gardnere",
    status: "Assigned",
    products: "7",
    amount: "₦10,040,888.03",
  },
  {
    id: 3,
    orderNumber: "125965",
    date: "31-03-2021",
    routeName: "Fohjipfe",
    deliveryDriver: "ActiveSylvia Sutton",
    status: "Accepted",
    products: "3",
    amount: "₦10,040,888.03",
  },
  {
    id: 4,
    orderNumber: "34998",
    date: "21-07-2021d",
    routeName: "Lipvuwo",
    deliveryDriver: "Lula Haynes",
    status: "Rejected",
    products: "3",
    amount: "₦10,040,888.03",
  },
  {
    id: 5,
    orderNumber: "227052",
    date: "24-05-2021",
    routeName: "Pefnuko",
    deliveryDriver: "Kenneth Barnes",
    status: "Open",
    products: "6",
    amount: "₦10,040,888.03",
  },
];

export const MainOrdersList = [
  {
    id: 1,
    orderNumber: "196125",
    date: "30-04-2021",
    customerName: "Augusta Sanchez Bar",
    routeName: "Ebzopoc",
    deliveryDriver: "Nathan Wallace",
    status: "Completed",
    products: "7",
    amount: "₦10,040,888.03",
  },
  {
    id: 2,
    orderNumber: "106966",
    date: "01-09-2021",
    customerName: "Sally Cobb Bar",
    routeName: "Hurouk",
    deliveryDriver: "Georgia Gardnere",
    status: "Assigned",
    products: "7",
    amount: "₦10,040,888.03",
  },
  {
    id: 3,
    orderNumber: "125965",
    date: "31-03-2021",
    customerName: "Charles Brooks Bar",
    routeName: "Fohjipfe",
    deliveryDriver: "ActiveSylvia Sutton",
    status: "Accepted",
    products: "3",
    amount: "₦10,040,888.03",
  },
  {
    id: 4,
    orderNumber: "34998",
    date: "21-07-2021d",
    customerName: "Birdie Lloyd Bar",
    routeName: "Lipvuwo",
    deliveryDriver: "Lula Haynes",
    status: "Rejected",
    products: "3",
    amount: "₦10,040,888.03",
  },
  {
    id: 5,
    orderNumber: "227052",
    date: "24-05-2021",
    customerName: "Isabella Massey Bar",
    routeName: "Pefnuko",
    deliveryDriver: "Kenneth Barnes",
    status: "Open",
    products: "6",
    amount: "₦10,040,888.03",
  },
];

export const OrderSummaryData = [
  {
    id: 1,
    type: "Budweiser 600 ml × 12 (RB)",
    label: "Liquid",
    quantity: "200",
    labelColor: "#D86217",
    image: trophyStout,
    price: "2,800",
    amount: "5,600,000",
  },
  {
    id: 2,
    type: "Budweiser 600 ml × 12 (RB)",
    label: "Can",
    quantity: 150,
    labelColor: "#F49C00",
    image: trophyLager,
    price: "3,500",
    amount: "525,000",
  },
  {
    id: 3,
    type: "Trophy Stout 600 ml × 12 (RB)",
    label: "Liquid",
    quantity: 150,
    labelColor: "#F49C00",
    image: trophyLager,
    price: "2,000",
    amount: "300,000",
  },
  {
    id: 4,
    type: "Hero Lager 600 ml × 12 (RB)",
    label: "Liquid",
    quantity: 200,
    labelColor: "#D86217",
    image: castleLite,
    price: "2,000",
    amount: "400,000",
  },
  {
    id: 5,
    type: "Hero Lager 500 ml × 24 (CAN)",
    label: "Can",
    quantity: 1200,
    labelColor: "#D86217",
    image: heroLagerCan,
    price: "2,000",
    amount: "2,400,000",
  },
  {
    id: 6,
    type: "Budweiser 500 ml × 24 (CAN)",
    label: "Can",
    quantity: 12000,
    labelColor: "#F49C00",
    image: heroLagerCan,
    price: "2,000",
    amount: "500,000",
  },
];

export const PricingList = [
  {
    id: 1,
    image: trophyLager,
    name: "Budweiser 600 ml × 12 (RB)",
    type: "Liquid",
  },
  {
    id: 2,
    image: trophyLager,
    name: "Budweiser 600 ml × 12 (RB)",
    type: "Liquid",
  },
  {
    id: 3,
    image: trophyLager,
    name: "Budweiser 600 ml × 12 (RB)",
    type: "Liquid",
  },
  {
    id: 4,
    image: trophyLager,
    name: "Budweiser 600 ml × 12 (RB)",
    type: "Liquid",
  },
  {
    id: 5,
    image: trophyLager,
    name: "Budweiser 600 ml × 12 (RB)",
    type: "Liquid",
  },
  {
    id: 6,
    image: trophyLager,
    name: "Budweiser 600 ml × 12 (RB)",
    type: "Liquid",
  },
  {
    id: 7,
    image: trophyLager,
    name: "Budweiser 600 ml × 12 (RB)",
    type: "Liquid",
  },
  {
    id: 8,
    image: trophyLager,
    name: "Budweiser 600 ml × 12 (RB)",
    type: "Liquid",
  },
  {
    id: 9,
    image: trophyLager,
    name: "Budweiser 600 ml × 12 (RB)",
    type: "Liquid",
  },
];

export const DropPoints = [
  {
    id: 1,
    drop_point: "Carigow Lucas Warehouse",
    address: "46, Fatai Aremo Lane, Off Mr. Biggs, Ikeja Along",
    city: "Cibefata",
    coordinate: "6.5244° N, 3.3792° E",
  },
  {
    id: 2,
    drop_point: "Jesavut Rena Warehouse",
    address: "46, Fatai Aremo Lane, Off Mr. Biggs, Ikeja Along",
    city: "Vucfafli",
    coordinate: "6.5244° N, 3.3792° E",
  },
  {
    id: 3,
    drop_point: "Jaezaugo Phillip Warehouse",
    address: "46, Fatai Aremo Lane, Off Mr. Biggs, Ikeja Along",
    city: "Ofolagme",
    coordinate: "6.5244° N, 3.3792° E",
  },
  {
    id: 4,
    drop_point: "Binjimwe Edgar Warehouse",
    address: "46, Fatai Aremo Lane, Off Mr. Biggs, Ikeja Along",
    city: "Gofpemi",
    coordinate: "6.5244° N, 3.3792° E",
  },
  {
    id: 5,
    drop_point: "Sibregob Frank Warehouse",
    address: "46, Fatai Aremo Lane, Off Mr. Biggs, Ikeja Along",
    city: "Kulhonole",
    coordinate: "6.5244° N, 3.3792° E",
  },
];

export const KPOList = [
  {
    code: "0022211",
    name: "Steve Simmons",
    distributor: "6",
    status: "Active",
    email: "a.nwokocha@ng.ab-inbev.com",
    phone: "08012345678",
  },
  {
    code: "0022211",
    name: "Steve Simmons",
    distributor: "6",
    status: "Active",
    email: "a.nwokocha@ng.ab-inbev.com",
    phone: "08012345678",
  },
  {
    code: "0022211",
    name: "Steve Simmons",
    distributor: "6",
    status: "Active",
    email: "a.nwokocha@ng.ab-inbev.com",
    phone: "08012345678",
  },
  {
    code: "0022211",
    name: "Steve Simmons",
    distributor: "6",
    status: "Active",
    email: "a.nwokocha@ng.ab-inbev.com",
    phone: "08012345678",
  },
  {
    code: "0022211",
    name: "Steve Simmons",
    distributor: "6",
    status: "Active",
    email: "a.nwokocha@ng.ab-inbev.com",
    phone: "08012345678",
  },
  {
    code: "0022211",
    name: "Steve Simmons",
    distributor: "6",
    status: "Active",
    email: "a.nwokocha@ng.ab-inbev.com",
    phone: "08012345678",
  },
  {
    code: "0022211",
    name: "Steve Simmons",
    distributor: "6",
    status: "Active",
    email: "a.nwokocha@ng.ab-inbev.com",
    phone: "08012345678",
  },
  {
    code: "0022211",
    name: "Steve Simmons",
    distributor: "6",
    status: "Active",
    email: "a.nwokocha@ng.ab-inbev.com",
    phone: "08012345678",
  },
  {
    code: "0022211",
    name: "Steve Simmons",
    distributor: "6",
    status: "Active",
    email: "a.nwokocha@ng.ab-inbev.com",
    phone: "08012345678",
  },
  {
    code: "0022211",
    name: "Steve Simmons",
    distributor: "6",
    status: "Active",
    email: "a.nwokocha@ng.ab-inbev.com",
    phone: "08012345678",
  },
];

export const ManagedDistributors = [
  {
    distributor: "KMS Nigeria Limited",
    code: "LAG/SOU/002",
    status: "Active",
  },
  {
    distributor: "KMS Nigeria Limited",
    code: "LAG/SOU/002",
    status: "Active",
  },
  {
    distributor: "KMS Nigeria Limited",
    code: "LAG/SOU/002",
    status: "Active",
  },
  {
    distributor: "KMS Nigeria Limited",
    code: "LAG/SOU/002",
    status: "Active",
  },
  {
    distributor: "KMS Nigeria Limited",
    code: "LAG/SOU/002",
    status: "Active",
  },
];

export const SortFilters = [
  "Product Name (A - Z)",
  "Product Name (Z - A)",
  "Quantity (High to Low)",
  "Quantity (Low to High)",
];


export const ProductTypes = ["All Products", "ABI Products", "Other Products"];
