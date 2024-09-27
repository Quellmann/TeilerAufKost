import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Overview from './pages/Overview.jsx'
import Spendings from './pages/Spendings.jsx'
import NewGroup from './pages/NewGroup.jsx'
import NewSpending from './pages/NewSpending.jsx'
import NewTransaction from './pages/NewTransaction.jsx'
import NewPerson from './pages/NewPerson.jsx'
import LandingPage from './pages/LandingPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage></LandingPage>,
      },
      {
        path: "/newGroup",
        element: <NewGroup></NewGroup>,
      },
      {
        path: "/:groupId",
        element: <Overview />,
      },
      {
        path: "/:groupId/spendings",
        element: <Spendings />
      },
      {
        path: "/:groupId/newSpending",
        element: <NewSpending></NewSpending>
      },
      {
        path: "/:groupId/newTransaction",
        element: <NewTransaction></NewTransaction>
      },
      {
        path: "/:groupId/newPerson",
        element: <NewPerson></NewPerson>
      },
      {
        path: "*",
        element: <NotFoundPage></NotFoundPage>
      },
      {
        path: "/not-found",
        element: <NotFoundPage></NotFoundPage>
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
