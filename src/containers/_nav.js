import { PERMISSIONS } from "src/service/permissionService";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Trang chủ",
    to: "/dashboard",
    icon: "cil-speedometer",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Danh sách đề tài",
    to: "/refer-topics/outline",
    icon: "cil-notes",
    permissions: [PERMISSIONS.STUDENT],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Đăng ký đề tài",
    to: "/topics/outline",
    icon: "cil-file",
    permissions: [PERMISSIONS.STUDENT],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Danh sách đề tài",
    to: "/topics/outline",
    icon: "cil-notes",
    permissions: [PERMISSIONS.EDUCATION_STAFF],
  },
  {
    _tag: "CSidebarNavTitle",
    _children: ["Giáo viên"],
    permissions: [PERMISSIONS.HEAD_SUBJECT_DEPARTMENT],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Đề tài thực hiện",
    to: "/execute",
    icon: "cil-home",
    permissions: [PERMISSIONS.STUDENT],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Đề tài hướng dẫn",
    to: "/guide",
    icon: "cil-file",
    permissions: [PERMISSIONS.HEAD_SUBJECT_DEPARTMENT, PERMISSIONS.TEACHER],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Đề tài phản biện",
    to: "/review",
    icon: "cil-speech",
    permissions: [PERMISSIONS.HEAD_SUBJECT_DEPARTMENT, PERMISSIONS.TEACHER],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Hội đồng",
    to: "/council",
    icon: "cil-people",
    permissions: [PERMISSIONS.HEAD_SUBJECT_DEPARTMENT, PERMISSIONS.TEACHER],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Người dùng",
    to: "/users",
    icon: "cil-user",
  },
  {
    _tag: "CSidebarNavTitle",
    _children: ["Trưởng bộ môn"],
    permissions: [PERMISSIONS.HEAD_SUBJECT_DEPARTMENT],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Phân công phản biện",
    to: "/assign-review",
    icon: "cil-spreadsheet",
    permissions: [PERMISSIONS.HEAD_SUBJECT_DEPARTMENT],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Phân công hội đồng",
    to: "/assign-council",
    icon: "cil-user-follow",
    permissions: [PERMISSIONS.HEAD_SUBJECT_DEPARTMENT],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Sắp xếp hội đồng",
    to: "/assign-council",
    icon: "cil-user-follow",
    permissions: [PERMISSIONS.EDUCATION_STAFF],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Học kỳ",
    to: "/semesters",
    icon: "cil-chart-pie",
    permissions: [PERMISSIONS.EDUCATION_STAFF],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Mẫu tiêu chí",
    to: "/templates",
    icon: "cil-file",
    permissions: [PERMISSIONS.EDUCATION_STAFF],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Cài đặt thành viên hội đồng",
    to: "/setting-council",
    icon: "cil-people",
    permissions: [PERMISSIONS.ADMIN],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Cài đặt cấu trúc",
    to: "/setting-common",
    icon: "cil-settings",
    permissions: [PERMISSIONS.ADMIN],
  },

  // -----------------------------------------------------------------------------------------------------------------------------------------
  // {
  //   _tag: "CSidebarNavTitle",
  //   _children: ["Theme"],
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Colors",
  //   to: "/theme/colors",
  //   icon: "cil-drop",
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Typography",
  //   to: "/theme/typography",
  //   icon: "cil-pencil",
  // },
  // {
  //   _tag: "CSidebarNavTitle",
  //   _children: ["Components"],
  // },
  // {
  //   _tag: "CSidebarNavDropdown",
  //   name: "Base",
  //   route: "/base",
  //   icon: "cil-puzzle",
  //   _children: [
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Breadcrumb",
  //       to: "/base/breadcrumbs",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Cards",
  //       to: "/base/cards",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Carousel",
  //       to: "/base/carousels",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Collapse",
  //       to: "/base/collapses",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Forms",
  //       to: "/base/forms",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Jumbotron",
  //       to: "/base/jumbotrons",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "List group",
  //       to: "/base/list-groups",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Navs",
  //       to: "/base/navs",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Navbars",
  //       to: "/base/navbars",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Pagination",
  //       to: "/base/paginations",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Popovers",
  //       to: "/base/popovers",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Progress",
  //       to: "/base/progress-bar",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Switches",
  //       to: "/base/switches",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Tables",
  //       to: "/base/tables",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Tabs",
  //       to: "/base/tabs",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Tooltips",
  //       to: "/base/tooltips",
  //     },
  //   ],
  // },
  // {
  //   _tag: "CSidebarNavDropdown",
  //   name: "Buttons",
  //   route: "/buttons",
  //   icon: "cil-cursor",
  //   _children: [
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Buttons",
  //       to: "/buttons/buttons",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Brand buttons",
  //       to: "/buttons/brand-buttons",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Buttons groups",
  //       to: "/buttons/button-groups",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Dropdowns",
  //       to: "/buttons/button-dropdowns",
  //     },
  //   ],
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Charts",
  //   to: "/charts",
  //   icon: "cil-chart-pie",
  // },
  // {
  //   _tag: "CSidebarNavDropdown",
  //   name: "Icons",
  //   route: "/icons",
  //   icon: "cil-star",
  //   _children: [
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "CoreUI Free",
  //       to: "/icons/coreui-icons",
  //       badge: {
  //         color: "success",
  //         text: "NEW",
  //       },
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "CoreUI Flags",
  //       to: "/icons/flags",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "CoreUI Brands",
  //       to: "/icons/brands",
  //     },
  //   ],
  // },
  // {
  //   _tag: "CSidebarNavDropdown",
  //   name: "Notifications",
  //   route: "/notifications",
  //   icon: "cil-bell",
  //   _children: [
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Alerts",
  //       to: "/notifications/alerts",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Badges",
  //       to: "/notifications/badges",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Modal",
  //       to: "/notifications/modals",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Toaster",
  //       to: "/notifications/toaster",
  //     },
  //   ],
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Widgets",
  //   to: "/widgets",
  //   icon: "cil-calculator",
  //   badge: {
  //     color: "info",
  //     text: "NEW",
  //   },
  // },
  // {
  //   _tag: "CSidebarNavDivider",
  // },
  // {
  //   _tag: "CSidebarNavTitle",
  //   _children: ["Extras"],
  // },
  // {
  //   _tag: "CSidebarNavDropdown",
  //   name: "Pages",
  //   route: "/pages",
  //   icon: "cil-star",
  //   _children: [
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Login",
  //       to: "/login",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Register",
  //       to: "/register",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Error 404",
  //       to: "/404",
  //     },
  //     {
  //       _tag: "CSidebarNavItem",
  //       name: "Error 500",
  //       to: "/500",
  //     },
  //   ],
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Disabled",
  //   icon: "cil-ban",
  //   badge: {
  //     color: "secondary",
  //     text: "NEW",
  //   },
  //   addLinkClass: "c-disabled",
  //   disabled: true,
  // },
  // {
  //   _tag: "CSidebarNavDivider",
  //   className: "m-2",
  // },
  // {
  //   _tag: "CSidebarNavTitle",
  //   _children: ["Labels"],
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Label danger",
  //   to: "",
  //   icon: {
  //     name: "cil-star",
  //     className: "text-danger",
  //   },
  //   label: true,
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Label info",
  //   to: "",
  //   icon: {
  //     name: "cil-star",
  //     className: "text-info",
  //   },
  //   label: true,
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Label warning",
  //   to: "",
  //   icon: {
  //     name: "cil-star",
  //     className: "text-warning",
  //   },
  //   label: true,
  // },
  // {
  //   _tag: "CSidebarNavDivider",
  //   className: "m-2",
  // },
];

export default _nav;
