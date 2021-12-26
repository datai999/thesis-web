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
const TemplateList = React.lazy(() => import("./pages/template/TemplateList"));
const TemplateDetail = React.lazy(() =>
  import("./pages/template/TemplateDetail")
);
const ShareSetting = React.lazy(() => import("./pages/setting/ShareSetting"));
const CouncilSetting = React.lazy(() =>
  import("./pages/setting/council/CouncilSetting")
);

let routes = [
  { path: "/dashboard", name: "Trang chủ", component: Dashboard },
  {
    path: "/refer-topics",
    exact: true,
    name: "Đề tài tham khảo",
    component: ReferTopics,
  },
  {
    path: "/refer-topics/outline",
    exact: false,
    name: "Đề cương",
    component: ReferTopics,
  },
  {
    path: "/refer-topics/thesis",
    exact: false,
    name: "Luận văn",
    component: ReferTopics,
  },
  {
    path: "/refer-topics/:id",
    exact: false,
    name: "Thông tin đề tài",
    component: TopicDetail,
  },

  { path: "/topics", exact: true, name: "Đề tài", component: Topics },
  {
    path: "/topics/outline",
    exact: false,
    name: "Đề cương",
    component: Topics,
  },
  { path: "/topics/thesis", exact: false, name: "Luận văn", component: Topics },
  {
    path: "/topics/:id",
    exact: true,
    name: "Thông tin đề tài",
    component: TopicDetail,
  },
  {
    path: "/topics/:id/edit",
    exact: false,
    name: "Chỉnh sửa đề tài",
    component: CreateTopic,
  },

  {
    path: "/execute",
    exact: false,
    name: "Đề tài thực hiện",
    component: TopicExecutes,
  },
  {
    path: "/guide",
    exact: true,
    name: "Đề tài hướng dẫn",
    component: GuideList,
  },
  {
    path: "/guide/:id",
    exact: true,
    // name: "Học kỳ",
    component: GuideList,
  },
  {
    path: "/guide/:id/create",
    exact: false,
    name: "Tạo đề tài",
    component: CreateTopic,
  },
  {
    path: "/guide/:id/:id",
    exact: true,
    name: "Thông tin đề tài",
    component: GuideTopicDetail,
  },
  // {
  //   path: "/guide/:id/:id/edit",
  //   exact: false,
  //   name: "Chỉnh sửa đề tài",
  //   component: CreateTopic,
  // },
  {
    path: "/guide/:id/:id/mark",
    exact: false,
    name: "Đánh giá sinh viên",
    component: Mark,
  },
  {
    path: "/review",
    exact: true,
    name: "Đề tài phản biện",
    component: ReviewList,
  },
  {
    path: "/review/:id",
    exact: true,
    // name: "Học kỳ",
    component: ReviewList,
  },
  {
    path: "/review/:id/:id",
    exact: true,
    name: "Thông tin đề tài",
    component: ReviewDetail,
  },
  {
    path: "/review/:id/:id/mark",
    exact: false,
    name: "Đánh giá sinh viên",
    component: Mark,
  },
  {
    path: "/assign-review",
    exact: true,
    name: "Phân công phản biện",
    component: AssignReviewList,
  },
  {
    path: "/assign-review/:id",
    exact: true,
    // name: "Học kỳ",
    component: AssignReviewList,
  },
  {
    path: "/council",
    exact: true,
    name: "Hội đồng",
    component: CouncilList,
  },
  {
    path: "/council/:id",
    exact: true,
    // name: "Học kỳ",
    component: CouncilList,
  },
  {
    path: "/council/:id/:id",
    exact: true,
    name: "Thông tin hội đồng",
    component: CouncilDetail,
  },
  {
    path: "/council/:id/:id/:id",
    exact: true,
    name: "Thông tin đề tài",
    component: CouncilMark,
  },
  {
    path: "/council/:id/:id/:id/mark",
    exact: false,
    name: "Đánh giá sinh viên",
    component: Mark,
  },
  {
    path: "/assign-council",
    exact: true,
    name: "Phân công hội đồng",
    component: AssignCouncilList,
  },
  {
    path: "/assign-council/:id",
    exact: true,
    // name: "Phòng ban",
    component: AssignCouncilList,
  },
  {
    path: "/assign-council/:id/:id",
    exact: true,
    // name: "Học kỳ",
    component: AssignCouncilList,
  },
  {
    path: "/assign-council/:id/:id/create",
    exact: false,
    name: "Tạo hội đồng",
    component: CreateCouncil,
  },
  {
    path: "/assign-council/:id/:id/edit/:id",
    name: "Chỉnh sửa hội đồng",
    component: AssignCouncil,
  },
  {
    path: "/users",
    exact: true,
    name: "Người dùng",
    component: Users,
  },
  {
    path: "/users/student",
    exact: false,
    name: "Sinh viên",
    component: Users,
  },
  {
    path: "/users/teacher",
    exact: true,
    name: "Giáo viên",
    component: Users,
  },
  {
    path: "/users/teacher/create",
    exact: false,
    name: "Thêm giáo viên",
    component: EditUser,
  },
  {
    path: "/users/head",
    exact: true,
    name: "Trưởng bộ môn",
    component: Users,
  },
  {
    path: "/users/head/create",
    exact: false,
    name: "Thêm trưởng bộ môn",
    component: EditUser,
  },
  {
    path: "/users/edu-staff",
    exact: true,
    name: "Giáo vụ",
    component: Users,
  },
  {
    path: "/users/edu-staff/create",
    exact: false,
    name: "Thêm giáo vụ",
    component: EditUser,
  },
  {
    path: "/users/admin",
    exact: true,
    name: "Quản trị hệ thống",
    component: Users,
  },
  {
    path: "/users/admin/create",
    exact: false,
    name: "Thêm quản trị viên",
    component: EditUser,
  },
  {
    path: "/users/:id",
    exact: true,
    name: "Thông tin người dùng",
    component: UserDetail,
  },
  {
    path: "/users/:id/edit",
    exact: false,
    name: "Chỉnh sửa thông tin người dùng",
    component: EditUser,
  },
  { path: "/semesters", exact: false, name: "Học kỳ", component: Semesters },
  {
    path: "/templates",
    exact: true,
    name: "Mẫu tiêu chí",
    component: TemplateList,
  },
  {
    path: "/templates/create",
    exact: false,
    name: "Soạn mẫu tiêu chí",
    component: TemplateDetail,
  },
  {
    path: "/templates/:id",
    exact: false,
    name: "Chi tiết mẫu tiêu chí",
    component: TemplateDetail,
  },
  {
    path: "/setting-common",
    exact: false,
    name: "Cài đặt cấu trúc hệ thống",
    component: ShareSetting,
  },
  {
    path: "/setting-council",
    exact: false,
    name: "Cài đặt thành viên hội đồng",
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
