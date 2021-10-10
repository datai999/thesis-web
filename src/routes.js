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
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
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
const Users = React.lazy(() => import("./views/users/Users"));
const User = React.lazy(() => import("./views/users/User"));

const Topics = React.lazy(() => import("./views/pages/topic/Topics"));
const MyTopics = React.lazy(() => import("./pages/topic/my/MyTopics"));
const CreateTopic = React.lazy(() => import("./pages/topic/my/CreateTopic"));
const Mark = React.lazy(() => import("./pages/topic/mark/Mark"));

const Teachers = React.lazy(() => import("./views/pages/teacher/Teachers"));
const TeacherCreate = React.lazy(() =>
  import("./views/pages/teacher/TeacherCreate")
);

const Students = React.lazy(() => import("./views/pages/student/Students"));

const AssignReview = React.lazy(() =>
  import("./pages/assign/review/AssignReview")
);
const CouncilTable = React.lazy(() => import("./pages/council/CouncilTable"));
const Council = React.lazy(() => import("./pages/council/Council"));
const AssignCouncil = React.lazy(() => import("./pages/council/AssignCouncil"));
const Semesters = React.lazy(() => import("./pages/semester/Semesters"));
const Templates = React.lazy(() => import("./pages/template/Templates"));
const TemplateDetail = React.lazy(() =>
  import("./pages/template/TemplateDetail")
);
const ShareSetting = React.lazy(() => import("./pages/setting/ShareSetting"));
const CouncilSetting = React.lazy(() =>
  import("./pages/setting/council/CouncilSetting")
);

let routes = [
  { path: "/", exact: true, name: "Trang chủ" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/topics", exact: true, name: "Đề tài", component: Topics },
  { path: "/topics/outline", exact: true, name: "Đề cương", component: Topics },
  { path: "/topics/thesis", exact: true, name: "Luận văn", component: Topics },
  {
    path: "/my/topics",
    exact: true,
    name: "Đề tài của tôi",
    component: MyTopics,
  },
  {
    path: "/my/topics/execute",
    exact: true,
    name: "Thực thi",
    component: MyTopics,
  },
  {
    path: "/my/topics/guide",
    exact: true,
    name: "Hướng dẫn",
    component: MyTopics,
  },
  {
    path: "/my/topics/review",
    exact: true,
    name: "Phản biện",
    component: MyTopics,
  },
  {
    path: "/my/topics/create",
    exact: true,
    name: "Tạo đề tài",
    component: CreateTopic,
  },
  { path: "/my/topics/edit", name: "Chỉnh sửa đề tài", component: CreateTopic },
  {
    path: "/my/topics/:id/mark",
    name: "Chấm điểm",
    component: Mark,
  },
  { path: "/teachers", exact: true, name: "Giáo viên", component: Teachers },
  {
    path: "/teachers/create",
    name: "Thêm giáo viên",
    component: TeacherCreate,
  },
  { path: "/students", exact: true, name: "Sinh viên", component: Students },
  {
    path: "/assign/review",
    exact: true,
    name: "Phân công phản biện",
    component: AssignReview,
  },
  { path: "/assign/review/:id", component: AssignReview },
  { path: "/councils", exact: true, name: "Hội đồng", component: CouncilTable },
  {
    path: "/councils/:id",
    exact: true,
    component: CouncilTable,
  },
  { path: "/councils/:id/create", name: "Tạo hội đồng", component: Council },
  {
    path: "/councils/:id/edit/:id",
    name: "Chỉnh sửa hội đồng",
    component: AssignCouncil,
  },
  { path: "/semesters", exact: true, name: "Học kỳ", component: Semesters },
  {
    path: "/templates",
    exact: true,
    name: "Mẫu tiêu chí",
    component: Templates,
  },
  {
    path: "/templates/list",
    name: "Danh sách mẫu tiêu chí",
    component: Templates,
  },
  {
    path: "/templates/setting",
    name: "Cài đặt mẫu tiêu chí",
    component: Templates,
  },
  {
    path: "/templates/create",
    exact: true,
    name: "Soạn mẫu tiêu chí",
    component: TemplateDetail,
  },
  {
    path: "/templates/:id",
    exact: true,
    name: "Chi tiết mẫu tiêu chí",
    component: TemplateDetail,
  },
  {
    path: "/settings",
    exact: true,
    name: "Cài đặt",
  },
  {
    path: "/settings/common",
    exact: true,
    name: "Chung",
    component: ShareSetting,
  },
  {
    path: "/settings/council",
    exact: true,
    name: "Thành viên hội đồng",
    component: CouncilSetting,
  },

  { path: "/theme", name: "Theme", component: Colors, exact: true },
  { path: "/theme/colors", name: "Colors", component: Colors },
  { path: "/theme/typography", name: "Typography", component: Typography },
  { path: "/base", name: "Base", component: Cards, exact: true },
  { path: "/base/breadcrumbs", name: "Breadcrumbs", component: Breadcrumbs },
  { path: "/base/cards", name: "Cards", component: Cards },
  { path: "/base/carousels", name: "Carousel", component: Carousels },
  { path: "/base/collapses", name: "Collapse", component: Collapses },
  { path: "/base/forms", name: "Forms", component: BasicForms },
  { path: "/base/jumbotrons", name: "Jumbotrons", component: Jumbotrons },
  { path: "/base/list-groups", name: "List Groups", component: ListGroups },
  { path: "/base/navbars", name: "Navbars", component: Navbars },
  { path: "/base/navs", name: "Navs", component: Navs },
  { path: "/base/paginations", name: "Paginations", component: Paginations },
  { path: "/base/popovers", name: "Popovers", component: Popovers },
  { path: "/base/progress-bar", name: "Progress Bar", component: ProgressBar },
  { path: "/base/switches", name: "Switches", component: Switches },
  { path: "/base/tables", name: "Tables", component: Tables },
  { path: "/base/tabs", name: "Tabs", component: Tabs },
  { path: "/base/tooltips", name: "Tooltips", component: Tooltips },
  { path: "/buttons", name: "Buttons", component: Buttons, exact: true },
  { path: "/buttons/buttons", name: "Buttons", component: Buttons },
  {
    path: "/buttons/button-dropdowns",
    name: "Dropdowns",
    component: ButtonDropdowns,
  },
  {
    path: "/buttons/button-groups",
    name: "Button Groups",
    component: ButtonGroups,
  },
  {
    path: "/buttons/brand-buttons",
    name: "Brand Buttons",
    component: BrandButtons,
  },
  { path: "/charts", name: "Charts", component: Charts },
  { path: "/icons", exact: true, name: "Icons", component: CoreUIIcons },
  { path: "/icons/coreui-icons", name: "CoreUI Icons", component: CoreUIIcons },
  { path: "/icons/flags", name: "Flags", component: Flags },
  { path: "/icons/brands", name: "Brands", component: Brands },
  {
    path: "/notifications",
    name: "Notifications",
    component: Alerts,
    exact: true,
  },
  { path: "/notifications/alerts", name: "Alerts", component: Alerts },
  { path: "/notifications/badges", name: "Badges", component: Badges },
  { path: "/notifications/modals", name: "Modals", component: Modals },
  { path: "/notifications/toaster", name: "Toaster", component: Toaster },
  { path: "/widgets", name: "Widgets", component: Widgets },
  { path: "/users", exact: true, name: "Users", component: Users },
  { path: "/users/:id", exact: true, name: "User Details", component: User },
];

export default routes;
