// variants.ts

export const buttonBaseStyles = "px-4 py-2 border rounded-xl transition";

export const buttonColorStyles = {
  blue: {
    active: "bg-blue-500 dark:bg-blue-600 text-white border-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.4)] hover:bg-blue-600 dark:hover:bg-blue-700",
    inactive:
      "bg-white dark:bg-gray-700 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-white",
  },
  blueDark: {
    active: "bg-blue-700 dark:bg-blue-800 text-white border-blue-700 shadow-[0_0_8px_2px_rgba(59,130,246,0.4)] hover:bg-blue-800 dark:hover:bg-blue-900",
    inactive:
      "bg-white dark:bg-gray-700 border-blue-700 dark:border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-white",
  },
  purple: {
    active: "bg-purple-500 dark:bg-purple-600 text-white border-purple-500 shadow-[0_0_8px_2px_rgba(168,85,247,0.4)] hover:bg-purple-600 dark:hover:bg-purple-700",
    inactive:
      "bg-white dark:bg-gray-700 border-purple-500 dark:border-purple-400 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-600 hover:text-white",
  },
  green: {
    active: "bg-green-500 dark:bg-green-600 text-white border-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.4)] hover:bg-green-600 dark:hover:bg-green-700",
    inactive:
      "bg-white dark:bg-gray-700 border-green-500 dark:border-green-400 text-green-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-600 hover:text-white",
  },
  purpleDark: {
    active: "bg-purple-700 dark:bg-purple-800 text-white border-purple-700 shadow-[0_0_8px_2px_rgba(126,34,206,0.4)] hover:bg-purple-800 dark:hover:bg-purple-900",
    inactive:
      "bg-white dark:bg-gray-700 border-purple-700 dark:border-purple-600 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-600 hover:text-white",
  },
  success: {
    active: "bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-[0_0_8px_2px_rgba(22,163,74,0.4)]",
    inactive:
      "bg-white dark:bg-gray-700 border-green-600 dark:border-green-500 text-green-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-600 hover:text-white",
  },
  outline: {
    active: "bg-gray-100 border-gray-400 text-gray-600 border-gray-400 shadow-[0_0_8px_2px_rgba(156,163,175,0.4)] hover:bg-gray-200 dark:hover:bg-gray-600",
    inactive:
      "bg-white dark:bg-gray-700 border-gray-400 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600",
  },
  gray: {
    active: "bg-gray-500 dark:bg-gray-600 text-white border-gray-500 shadow-[0_0_8px_2px_rgba(156,163,175,0.4)] hover:bg-gray-600 dark:hover:bg-gray-700",
    inactive:
      "bg-white dark:bg-gray-700 border-gray-500 dark:border-gray-400 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600",
  },
};