/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { CreateSurprisePage } from './pages/CreateSurprisePage';
import { PublicSurprisePage } from './pages/PublicSurprisePage';
import { ManageSurprisePage } from './pages/ManageSurprisePage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans">
          <Routes>
            {/* Public recipient reveal experience has immersive custom header/footer inside component */}
            <Route path="/surprise/:slug" element={<PublicSurprisePage />} />

            {/* Standard platform layout with Navbar and Footer */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <LandingPage />
                  </main>
                  <Footer />
                </>
              }
            />

            <Route
              path="/templates"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <TemplatesPage />
                  </main>
                  <Footer />
                </>
              }
            />

            <Route
              path="/create"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <CreateSurprisePage />
                  </main>
                  <Footer />
                </>
              }
            />

            <Route
              path="/surprise/:slug/manage"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ManageSurprisePage />
                  </main>
                  <Footer />
                </>
              }
            />

            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <NotFoundPage />
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
