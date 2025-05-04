import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-800 py-6 md:py-0 bg-gray-900">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-gray-400 md:text-left">Developed by Husky</p>
        <p className="text-center text-sm leading-loose text-gray-400 md:text-right">
          <Link
            href="https://t.me/D0CTOIH_CMERTI"
            className="font-medium underline underline-offset-4 hover:text-blue-400 text-gray-300"
          >
            Contact
          </Link>
        </p>
      </div>
    </footer>
  )
}
