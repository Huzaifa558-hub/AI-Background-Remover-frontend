import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="relative mb-6">
        <div className="text-9xl font-display font-bold text-border opacity-50 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-magenta drop-shadow-md">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.671zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
          </svg>
        </div>
      </div>
      
      <h1 className="text-3xl font-display font-bold text-primary mb-3 tracking-tight">
        Page Not Found
      </h1>
      
      <p className="text-secondary mb-8 max-w-md mx-auto">
        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
      </p>
      
      <Link 
        to="/" 
        className="btn-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
          <path fillRule="evenodd" d="M9.205 2.41c.26.152.544.152.804 0l7.5-4.385A.75.75 0 0118.663 3v10a.75.75 0 01-.365.642l-7.5 4.385a.75.75 0 01-.804 0l-7.5-4.385A.75.75 0 012 13V3a.75.75 0 011.154-.642l7.5 4.385z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M3.5 4.887L10 8.68l6.5-3.792V12.62L10 16.412 3.5 12.62V4.887z" clipRule="evenodd" />
        </svg>
        Back to Home
      </Link>
    </main>
  )
}
