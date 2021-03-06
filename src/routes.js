import React from "react";

const Toaster = React.lazy(() =>
  import("./views/notifications/toaster/Toaster")
);
const Tables = React.lazy(() => import("./views/base/tables/Tables"));

const Breadcrumbs = React.lazy(() =>
  import("./views/base/breadcrumbs/Breadcrumbs")
);
const Cards = React.lazy(() => import("./views/base/cards/Cards"));
const Carousels = React.lazy(() => import("./views/base/carousels/Carousels"));
const Collapses = React.lazy(() => import("./views/base/collapses/Collapses"));
const BasicForms = React.lazy(() => import("./views/base/forms/BasicForms"));

const Jumbotrons = React.lazy(() =>
  import("./views/base/jumbotrons/Jumbotrons")
);
const ListGroups = React.lazy(() =>
  import("./views/base/list-groups/ListGroups")
);
const Navbars = React.lazy(() => import("./views/base/navbars/Navbars"));
const Navs = React.lazy(() => import("./views/base/navs/Navs"));
const Paginations = React.lazy(() =>
  import("./views/base/paginations/Pagnations")
);
const Popovers = React.lazy(() => import("./views/base/popovers/Popovers"));
const ProgressBar = React.lazy(() =>
  import("./views/base/progress-bar/ProgressBar")
);
const Switches = React.lazy(() => import("./views/base/switches/Switches"));

const Tabs = React.lazy(() => import("./views/base/tabs/Tabs"));
const Tooltips = React.lazy(() => import("./views/base/tooltips/Tooltips"));
const BrandButtons = React.lazy(() =>
  import("./views/buttons/brand-buttons/BrandButtons")
);
const ButtonDropdowns = React.lazy(() =>
  import("./views/buttons/button-dropdowns/ButtonDropdowns")
);
const ButtonGroups = React.lazy(() =>
  import("./views/buttons/button-groups/ButtonGroups")
);
const Buttons = React.lazy(() => import("./views/buttons/buttons/Buttons"));
const Charts = React.lazy(() => import("./views/charts/Charts"));
const CoreUIIcons = React.lazy(() =>
  import("./views/icons/coreui-icons/CoreUIIcons")
);
const Flags = React.lazy(() => import("./views/icons/flags/Flags"));
const Brands = React.lazy(() => import("./views/icons/brands/Brands"));
const Alerts = React.lazy(() => import("./views/notifications/alerts/Alerts"));
const Badges = React.lazy(() => import("./views/notifications/badges/Badges"));
const Modals = React.lazy(() => import("./views/notifications/modals/Modals"));
const Colors = React.lazy(() => import("./views/theme/colors/Colors"));
const Typography = React.lazy(() =>
  import("./views/theme/typography/Typography")
);
const Widgets = React.lazy(() => import("./views/widgets/Widgets"));

// ---------------------------------------------------------------------------------

const Dashboard = React.lazy(() => import("./pages/dashboard/Dashboard"));
const Topics = React.lazy(() => import("./pages/topic/Topics"));
const ReferTopics = React.lazy(() => import("./pages/topic/ReferTopics"));
const TopicDetail = React.lazy(() => import("./pages/topic/TopicDetail"));

const TopicExecutes = React.lazy(() => import("./pages/execute/TopicExecutes"));
const GuideList = React.lazy(() => import("./pages/guide/GuideList"));
const GuideTopicDetail = React.lazy(() =>
  import("./pages/guide/GuideTopicDetail")
);
const CreateTopic = React.lazy(() => import("./pages/guide/CreateTopic"));
const Mark = React.lazy(() => import("./pages/mark/Mark"));

const ReviewList = React.lazy(() => import("./pages/review/ReviewList"));
const ReviewDetail = React.lazy(() => import("./pages/review/ReviewDetail"));
const AssignReviewList = React.lazy(() =>
  import("./pages/assign/review/AssignReviewList")
);

const CouncilList = React.lazy(() => import("./pages/council/CouncilList"));
const CouncilDetail = React.lazy(() => import("./pages/council/CouncilDetail"));
const CouncilMark = React.lazy(() => import("./pages/council/CouncilMark"));
const AssignCouncilList = React.lazy(() =>
  import("./pages/assign/council/AssignCouncilList")
);
const CreateCouncil = React.lazy(() =>
  import("./pages/assign/council/CreateCouncil")
);
const AssignCouncil = React.lazy(() =>
  import("./pages/assign/council/AssignCouncil")
);

const Users = React.lazy(() => import("./pages/user/Users"));
const UserDetail = React.lazy(() => import("./pages/user/UserDetail"));
const EditUser = React.lazy(() => import("./pages/user/EditUser"));
const Semesters = React.lazy(() => import("./pages/semester/Semesters"));
const SemesterDetail = React.lazy(() =>
  import("./pages/semester/SemesterDetail")
);

const TemplateList = React.lazy(() => import("./pages/template/TemplateList"));
const TemplateDetail = React.lazy(() =>
  import("./pages/template/TemplateDetail")
);
const ShareSetting = React.lazy(() => import("./pages/setting/ShareSetting"));
const CouncilSetting = React.lazy(() =>
  import("./pages/setting/council/CouncilSetting")
);

let routes = [
  { path: "/dashboard", name: "Trang ch???", component: Dashboard },
  {
    path: "/refer-topics",
    exact: true,
    name: "????? t??i tham kh???o",
    component: ReferTopics,
  },
  {
    path: "/refer-topics/outline",
    exact: false,
    name: "????? c????ng",
    component: ReferTopics,
  },
  {
    path: "/refer-topics/thesis",
    exact: false,
    name: "Lu???n v??n",
    component: ReferTopics,
  },
  {
    path: "/refer-topics/:id",
    exact: false,
    name: "Th??ng tin ????? t??i",
    component: TopicDetail,
  },

  { path: "/topics", exact: true, name: "????? t??i", component: Topics },
  {
    path: "/topics/outline",
    exact: false,
    name: "????? c????ng",
    component: Topics,
  },
  { path: "/topics/thesis", exact: false, name: "Lu???n v??n", component: Topics },
  {
    path: "/topics/:id",
    exact: true,
    name: "Th??ng tin ????? t??i",
    component: TopicDetail,
  },
  {
    path: "/topics/:id/edit",
    exact: false,
    name: "Ch???nh s???a ????? t??i",
    component: CreateTopic,
  },

  {
    path: "/execute",
    exact: false,
    name: "????? t??i th???c hi???n",
    component: TopicExecutes,
  },
  {
    path: "/guide",
    exact: true,
    name: "????? t??i h?????ng d???n",
    component: GuideList,
  },
  {
    path: "/guide/:id",
    exact: true,
    // name: "H???c k???",
    component: GuideList,
  },
  {
    path: "/guide/:id/create",
    exact: false,
    name: "T???o ????? t??i",
    component: CreateTopic,
  },
  {
    path: "/guide/:id/:id",
    exact: true,
    name: "Th??ng tin ????? t??i",
    component: GuideTopicDetail,
  },
  // {
  //   path: "/guide/:id/:id/edit",
  //   exact: false,
  //   name: "Ch???nh s???a ????? t??i",
  //   component: CreateTopic,
  // },
  {
    path: "/guide/:id/:id/mark",
    exact: false,
    name: "????nh gi?? sinh vi??n",
    component: Mark,
  },
  {
    path: "/review",
    exact: true,
    name: "????? t??i ph???n bi???n",
    component: ReviewList,
  },
  {
    path: "/review/:id",
    exact: true,
    // name: "H???c k???",
    component: ReviewList,
  },
  {
    path: "/review/:id/:id",
    exact: true,
    name: "Th??ng tin ????? t??i",
    component: ReviewDetail,
  },
  {
    path: "/review/:id/:id/mark",
    exact: false,
    name: "????nh gi?? sinh vi??n",
    component: Mark,
  },
  {
    path: "/assign-review",
    exact: true,
    name: "Ph??n c??ng ph???n bi???n",
    component: AssignReviewList,
  },
  {
    path: "/assign-review/:id",
    exact: true,
    // name: "H???c k???",
    component: AssignReviewList,
  },
  {
    path: "/council",
    exact: true,
    name: "H???i ?????ng",
    component: CouncilList,
  },
  {
    path: "/council/:id",
    exact: true,
    // name: "H???c k???",
    component: CouncilList,
  },
  {
    path: "/council/:id/:id",
    exact: true,
    name: "Th??ng tin h???i ?????ng",
    component: CouncilDetail,
  },
  {
    path: "/council/:id/:id/:id",
    exact: true,
    name: "Th??ng tin ????? t??i",
    component: CouncilMark,
  },
  {
    path: "/council/:id/:id/:id/mark",
    exact: false,
    name: "????nh gi?? sinh vi??n",
    component: Mark,
  },
  {
    path: "/assign-council",
    exact: true,
    name: "Ph??n c??ng h???i ?????ng",
    component: AssignCouncilList,
  },
  {
    path: "/assign-council/:id",
    exact: true,
    // name: "Ph??ng ban",
    component: AssignCouncilList,
  },
  {
    path: "/assign-council/:id/:id",
    exact: true,
    // name: "H???c k???",
    component: AssignCouncilList,
  },
  {
    path: "/assign-council/:id/:id/create",
    exact: false,
    name: "T???o h???i ?????ng",
    component: CreateCouncil,
  },
  {
    path: "/assign-council/:id/:id/edit/:id",
    name: "Ch???nh s???a h???i ?????ng",
    component: AssignCouncil,
  },
  {
    path: "/users",
    exact: true,
    name: "Ng?????i d??ng",
    component: Users,
  },
  {
    path: "/users/student",
    exact: false,
    name: "Sinh vi??n",
    component: Users,
  },
  {
    path: "/users/teacher",
    exact: true,
    name: "Gi??o vi??n",
    component: Users,
  },
  {
    path: "/users/teacher/create",
    exact: false,
    name: "Th??m gi??o vi??n",
    component: EditUser,
  },
  {
    path: "/users/head",
    exact: true,
    name: "Tr?????ng b??? m??n",
    component: Users,
  },
  {
    path: "/users/head/create",
    exact: false,
    name: "Th??m tr?????ng b??? m??n",
    component: EditUser,
  },
  {
    path: "/users/edu-staff",
    exact: true,
    name: "Gi??o v???",
    component: Users,
  },
  {
    path: "/users/edu-staff/create",
    exact: false,
    name: "Th??m gi??o v???",
    component: EditUser,
  },
  {
    path: "/users/admin",
    exact: true,
    name: "Qu???n tr??? h??? th???ng",
    component: Users,
  },
  {
    path: "/users/admin/create",
    exact: false,
    name: "Th??m qu???n tr??? vi??n",
    component: EditUser,
  },
  {
    path: "/users/:id",
    exact: true,
    name: "Th??ng tin ng?????i d??ng",
    component: UserDetail,
  },
  {
    path: "/users/:id/edit",
    exact: false,
    name: "Ch???nh s???a th??ng tin ng?????i d??ng",
    component: EditUser,
  },
  { path: "/semesters", exact: true, name: "H???c k???", component: Semesters },
  {
    path: "/semesters/create",
    exact: false,
    name: "T???o h???c k??? m???i",
    component: SemesterDetail,
  },
  {
    path: "/semesters/:id",
    exact: false,
    name: "Th??ng tin h???c k???",
    component: SemesterDetail,
  },

  {
    path: "/templates",
    exact: true,
    name: "M???u ti??u ch??",
    component: TemplateList,
  },
  {
    path: "/templates/:id",
    exact: true,
    // name: "M???u ti??u ch??",
    component: TemplateList,
  },
  {
    path: "/templates/:id/create",
    exact: false,
    name: "So???n m???u ti??u ch??",
    component: TemplateDetail,
  },
  {
    path: "/templates/:id/:id",
    exact: false,
    name: "Chi ti???t m???u ti??u ch??",
    component: TemplateDetail,
  },
  {
    path: "/setting-common",
    exact: false,
    name: "C??i ?????t c???u tr??c h??? th???ng",
    component: ShareSetting,
  },
  {
    path: "/setting-council",
    exact: false,
    name: "C??i ?????t th??nh vi??n h???i ?????ng",
    component: CouncilSetting,
  },

  // --------------------------------------------------------------------------------

  // { path: "/theme", name: "Theme", component: Colors, exact: true },
  // { path: "/theme/colors", name: "Colors", component: Colors },
  // { path: "/theme/typography", name: "Typography", component: Typography },
  // { path: "/base", name: "Base", component: Cards, exact: true },
  // { path: "/base/breadcrumbs", name: "Breadcrumbs", component: Breadcrumbs },
  // { path: "/base/cards", name: "Cards", component: Cards },
  // { path: "/base/carousels", name: "Carousel", component: Carousels },
  // { path: "/base/collapses", name: "Collapse", component: Collapses },
  // { path: "/base/forms", name: "Forms", component: BasicForms },
  // { path: "/base/jumbotrons", name: "Jumbotrons", component: Jumbotrons },
  // { path: "/base/list-groups", name: "List Groups", component: ListGroups },
  // { path: "/base/navbars", name: "Navbars", component: Navbars },
  // { path: "/base/navs", name: "Navs", component: Navs },
  // { path: "/base/paginations", name: "Paginations", component: Paginations },
  // { path: "/base/popovers", name: "Popovers", component: Popovers },
  // { path: "/base/progress-bar", name: "Progress Bar", component: ProgressBar },
  // { path: "/base/switches", name: "Switches", component: Switches },
  // { path: "/base/tables", name: "Tables", component: Tables },
  // { path: "/base/tabs", name: "Tabs", component: Tabs },
  // { path: "/base/tooltips", name: "Tooltips", component: Tooltips },
  // { path: "/buttons", name: "Buttons", component: Buttons, exact: true },
  // { path: "/buttons/buttons", name: "Buttons", component: Buttons },
  // {
  //   path: "/buttons/button-dropdowns",
  //   name: "Dropdowns",
  //   component: ButtonDropdowns,
  // },
  // {
  //   path: "/buttons/button-groups",
  //   name: "Button Groups",
  //   component: ButtonGroups,
  // },
  // {
  //   path: "/buttons/brand-buttons",
  //   name: "Brand Buttons",
  //   component: BrandButtons,
  // },
  // { path: "/charts", name: "Charts", component: Charts },
  // { path: "/icons", exact: true, name: "Icons", component: CoreUIIcons },
  // { path: "/icons/coreui-icons", name: "CoreUI Icons", component: CoreUIIcons },
  // { path: "/icons/flags", name: "Flags", component: Flags },
  // { path: "/icons/brands", name: "Brands", component: Brands },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   component: Alerts,
  //   exact: true,
  // },
  // { path: "/notifications/alerts", name: "Alerts", component: Alerts },
  // { path: "/notifications/badges", name: "Badges", component: Badges },
  // { path: "/notifications/modals", name: "Modals", component: Modals },
  // { path: "/notifications/toaster", name: "Toaster", component: Toaster },
  // { path: "/widgets", name: "Widgets", component: Widgets },
];

export default routes;
