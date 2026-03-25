import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { BookmarksBar } from './components/BookmarksBar';
import { ToolErrorBoundary } from './components/ToolErrorBoundary';
import { SiteFooter } from './components/SiteFooter';
import { useTheme } from './hooks/useTheme';
import { LoginPage } from './pages/LoginPage';
import { DepartmentRolePage } from './pages/DepartmentRolePage';
import { ToolSelectionPage } from './pages/ToolSelectionPage';
import { TermsPage } from './pages/site/TermsPage';
import { PrivacyPage } from './pages/site/PrivacyPage';
import { CookiePolicyPage } from './pages/site/CookiePolicyPage';
import { AcceptableUsePage } from './pages/site/AcceptableUsePage';
import { DisclaimerPage } from './pages/site/DisclaimerPage';
import { AboutPage } from './pages/site/AboutPage';
import { ContactPage } from './pages/site/ContactPage';

// JSON tools
import { JsonFormatter } from './tools/json/JsonFormatter';
import { JsonValidator } from './tools/json/JsonValidator';
import { JsonMinifier } from './tools/json/JsonMinifier';
import { JsonYaml } from './tools/json/JsonYaml';
import { JsonXml } from './tools/json/JsonXml';

// Converters
import { CsvJson } from './tools/csv/CsvJson';
import { Base64 } from './tools/encode/Base64';
import { UrlEncode } from './tools/encode/UrlEncode';

// Debug
import { JwtDecoder } from './tools/debug/JwtDecoder';
import { HashGenerator } from './tools/debug/HashGenerator';
import { UuidGenerator } from './tools/debug/UuidGenerator';
import { RegexTester } from './tools/debug/RegexTester';
import { CronBuilder } from './tools/debug/CronBuilder';
import { TimestampConverter } from './tools/debug/TimestampConverter';
import { CaseConverter } from './tools/debug/CaseConverter';
import { PasswordGenerator } from './tools/debug/PasswordGenerator';
import { PasswordStrengthChecker } from './tools/debug/PasswordStrengthChecker';
import { ColorConverter } from './tools/debug/ColorConverter';
import { LoremIpsum } from './tools/debug/LoremIpsum';

// Compare
import { DiffTool } from './tools/compare/DiffTool';

// API
import { CurlConverter } from './tools/api/CurlConverter';

// Data
import { FakerData } from './tools/data/FakerData';
import { DummyImages } from './tools/data/DummyImages';
import { DummyVideos } from './tools/data/DummyVideos';

// Media
import { ImageCompressor } from './tools/media/ImageCompressor';
import { ImageResizer } from './tools/media/ImageResizer';
import { RemoveBackground } from './tools/media/RemoveBackground';
import { MakeColorTransparent } from './tools/media/MakeColorTransparent';
import { ReplaceBackground } from './tools/media/ReplaceBackground';
import { PdfToImages } from './tools/media/PdfToImages';
import { Mp4ToMp3 } from './tools/media/Mp4ToMp3';
import { Mp3ToMp4 } from './tools/media/Mp3ToMp4';

// JSON extras
import { JsonFlatten } from './tools/json/JsonFlatten';
import { JsonToTypes } from './tools/json/JsonToTypes';
import { JsonToCsv } from './tools/json/JsonToCsv';

// Finance
import { CurrencyConverter } from './tools/finance/CurrencyConverter';
import { TaxCalculator } from './tools/finance/TaxCalculator';
import { EmiCalculator } from './tools/finance/EmiCalculator';
import { NumberToWords } from './tools/finance/NumberToWords';
import { PercentageCalculator } from './tools/finance/PercentageCalculator';
import { InvoiceGenerator } from './tools/finance/InvoiceGenerator';
import { TipCalculator } from './tools/finance/TipCalculator';
import { SplitBillCalculator } from './tools/finance/SplitBillCalculator';
import { CompoundInterestCalculator } from './tools/finance/CompoundInterestCalculator';

// Admin
import { QrGenerator } from './tools/admin/QrGenerator';
import { BarcodeGenerator } from './tools/admin/BarcodeGenerator';
import { PdfMerge } from './tools/admin/PdfMerge';
import { PdfSplit } from './tools/admin/PdfSplit';
import { PdfEditor } from './tools/admin/PdfEditor';
import { MyActivity } from './tools/admin/MyActivity';
import { ToolSuggestions } from './tools/general/ToolSuggestions';
import { UnitConverter } from './tools/admin/UnitConverter';
import { DateCalculator } from './tools/admin/DateCalculator';
import { AgeCalculator } from './tools/admin/AgeCalculator';
import { BmiCalculator } from './tools/admin/BmiCalculator';
import { WorkingDaysCalculator } from './tools/admin/WorkingDaysCalculator';
import { ConversionTool } from './tools/convert/ConversionTool';
import { ImageToPdf } from './tools/convert/ImageToPdf';
import { PngToIco } from './tools/convert/PngToIco';
import { PdfToTxt } from './tools/convert/PdfToTxt';
import { AudioConvert } from './tools/convert/AudioConvert';
import { VideoConvert } from './tools/convert/VideoConvert';

// Slips
import { RentSlipGenerator } from './tools/slips/RentSlipGenerator';
import { CashReceiptSlip } from './tools/slips/CashReceiptSlip';
import { SalaryAdvanceSlip } from './tools/slips/SalaryAdvanceSlip';
import { SecurityDepositSlip } from './tools/slips/SecurityDepositSlip';

// HR
import { LeaveCalculator } from './tools/hr/LeaveCalculator';
import { SalarySlipGenerator } from './tools/hr/SalarySlipGenerator';
import { EmployeeIdGenerator } from './tools/hr/EmployeeIdGenerator';
import { AttendanceCalculator } from './tools/hr/AttendanceCalculator';
import { OrgChartGenerator } from './tools/hr/OrgChartGenerator';

// Legal
import { WordCounter } from './tools/legal/WordCounter';
import { CaseNumberGenerator } from './tools/legal/CaseNumberGenerator';
import { DocumentIdGenerator } from './tools/legal/DocumentIdGenerator';

// Marketing
import { MetaTagsGenerator } from './tools/marketing/MetaTagsGenerator';
import { CharacterCounter } from './tools/marketing/CharacterCounter';
import { SocialPreview } from './tools/marketing/SocialPreview';

// Sales
import { CommissionCalculator } from './tools/sales/CommissionCalculator';
import { DiscountCalculator } from './tools/sales/DiscountCalculator';
import { QuoteGenerator } from './tools/sales/QuoteGenerator';

// Support
import { TicketIdGenerator } from './tools/support/TicketIdGenerator';
import { FaqGenerator } from './tools/support/FaqGenerator';
import { ResponseTemplate } from './tools/support/ResponseTemplate';

// Operations
import { InventoryCalculator } from './tools/operations/InventoryCalculator';
import { CapacityCalculator } from './tools/operations/CapacityCalculator';
import { ShippingCalculator } from './tools/operations/ShippingCalculator';

// Procurement
import { PurchaseOrderGenerator } from './tools/procurement/PurchaseOrderGenerator';
import { VendorComparison } from './tools/procurement/VendorComparison';

// QA
import { BugReportTemplate } from './tools/qa/BugReportTemplate';
import { TestCaseGenerator } from './tools/qa/TestCaseGenerator';
import { ReleaseNotesGenerator } from './tools/qa/ReleaseNotesGenerator';

// Student
import { CitationGenerator } from './tools/student/CitationGenerator';
import { EssayWordCounter } from './tools/student/EssayWordCounter';
import { PomodoroTimer } from './tools/student/PomodoroTimer';
import { FlashcardGenerator } from './tools/student/FlashcardGenerator';
import { ReadingTimeCalculator } from './tools/student/ReadingTimeCalculator';
import { StudyPlanner } from './tools/student/StudyPlanner';
import { NoteOutlineGenerator } from './tools/student/NoteOutlineGenerator';
import { GpaCalculator } from './tools/student/GpaCalculator';
import { PlatformFeeCalculator } from './tools/freelancer/PlatformFeeCalculator';
import { ProjectRateCalculator } from './tools/freelancer/ProjectRateCalculator';
import { TimesheetGenerator } from './tools/freelancer/TimesheetGenerator';
import { ReceiptGenerator } from './tools/freelancer/ReceiptGenerator';
import { MileageCalculator } from './tools/freelancer/MileageCalculator';
import { SelfEmploymentTaxEstimator } from './tools/freelancer/SelfEmploymentTaxEstimator';

function AppContent() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const onSuggestionsPage = location.pathname === '/tools/general/suggestions';

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    const openHandler = () => setPaletteOpen(true);
    window.addEventListener('keydown', keyHandler);
    window.addEventListener('open-command-palette', openHandler);
    return () => {
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('open-command-palette', openHandler);
    };
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/select-role" element={<DepartmentRolePage />} />
      <Route path="/terms-and-conditions" element={<TermsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPage />} />
      <Route path="/cookie-policy" element={<CookiePolicyPage />} />
      <Route path="/acceptable-use-policy" element={<AcceptableUsePage />} />
      <Route path="/disclaimer" element={<DisclaimerPage />} />
      <Route path="/about-us" element={<AboutPage />} />
      <Route path="/contact-us" element={<ContactPage />} />
      <Route path="/choose-tools" element={
        <ProtectedRoute>
          <ToolSelectionPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={
        <ProtectedRoute>
          <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg-primary)]">
            <header className="flex shrink-0 h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]/90 backdrop-blur">
              <button
                type="button"
                onClick={() => setSidebarOpen((o) => !o)}
                className="md:hidden p-2 rounded-[var(--radius-sm)] border border-[var(--border)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] transition-colors"
                aria-label="Toggle menu"
              >
                <span className="text-xl">{sidebarOpen ? '✕' : '☰'}</span>
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-sm sm:text-base font-semibold tracking-wide text-[var(--text-primary)] truncate">DevTool Global Workspace</h1>
                <p className="hidden sm:block text-xs text-[var(--text-muted)]">Fast and reliable tools for teams and individual users</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaletteOpen(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)]/35 transition-colors"
                >
                  <span>🔍</span>
                  <span className="hidden md:inline">Quick Search</span>
                  <kbd className="hidden md:inline px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] font-mono text-[var(--text-muted)]">Ctrl+F</kbd>
                </button>
                <button
                  type="button"
                  onClick={toggle}
                  className="p-2 sm:p-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors"
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
              </div>
            </header>
            <BookmarksBar />
            <div className="flex flex-1 overflow-hidden relative">
              <div
                className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
              <aside className={`fixed md:relative top-14 sm:top-16 bottom-0 md:top-auto md:bottom-auto left-0 md:left-auto z-50 md:z-auto w-[86vw] max-w-72 md:w-64 md:min-w-64 lg:w-72 lg:min-w-72 md:h-full flex-shrink-0 transform transition-transform duration-200 ease-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-[105%] md:translate-x-0'}`}>
                <Sidebar onNavigate={() => setSidebarOpen(false)} />
              </aside>
              <main className="flex-1 overflow-hidden flex flex-col min-w-0">
              <div className="flex-1 flex flex-col min-w-0 overflow-auto p-0 sm:p-4">
              <div className="flex-1 rounded-none sm:rounded-2xl border-x-0 sm:border border-[var(--border)] bg-[var(--bg-secondary)]/65 backdrop-blur-sm sm:shadow-[var(--shadow-elevated)] overflow-hidden">
              <ToolErrorBoundary key={location.pathname}>
              <Routes>
                <Route path="/" element={<Navigate to="/choose-tools" replace />} />
          <Route path="/tools/finance/currency" element={<CurrencyConverter />} />
          <Route path="/tools/finance/tax" element={<TaxCalculator />} />
          <Route path="/tools/finance/emi" element={<EmiCalculator />} />
          <Route path="/tools/finance/number-words" element={<NumberToWords />} />
          <Route path="/tools/finance/percentage" element={<PercentageCalculator />} />
          <Route path="/tools/finance/invoice" element={<InvoiceGenerator />} />
          <Route path="/tools/finance/tip" element={<TipCalculator />} />
          <Route path="/tools/finance/split-bill" element={<SplitBillCalculator />} />
          <Route path="/tools/finance/compound-interest" element={<CompoundInterestCalculator />} />
          <Route path="/tools/admin/qr" element={<QrGenerator />} />
          <Route path="/tools/admin/barcode" element={<BarcodeGenerator />} />
          <Route path="/tools/admin/pdf-merge" element={<PdfMerge />} />
          <Route path="/tools/admin/pdf-split" element={<PdfSplit />} />
          <Route path="/tools/admin/pdf-editor" element={<PdfEditor />} />
          <Route path="/tools/admin/my-activity" element={<MyActivity />} />
          <Route path="/tools/general/suggestions" element={<ToolSuggestions />} />
          <Route path="/tools/admin/unit-converter" element={<UnitConverter />} />
          <Route path="/tools/admin/date-calc" element={<DateCalculator />} />
          <Route path="/tools/admin/age" element={<AgeCalculator />} />
          <Route path="/tools/admin/bmi" element={<BmiCalculator />} />
          <Route path="/tools/admin/working-days" element={<WorkingDaysCalculator />} />
          <Route path="/tools/convert" element={<ConversionTool />} />
          <Route path="/tools/convert/image-pdf" element={<ImageToPdf />} />
          <Route path="/tools/convert/png-ico" element={<PngToIco />} />
          <Route path="/tools/convert/pdf-txt" element={<PdfToTxt />} />
          <Route path="/tools/convert/audio-convert" element={<AudioConvert />} />
          <Route path="/tools/convert/video-convert" element={<VideoConvert />} />
          <Route path="/tools/slips/rent" element={<RentSlipGenerator />} />
          <Route path="/tools/slips/cash-receipt" element={<CashReceiptSlip />} />
          <Route path="/tools/slips/salary-advance" element={<SalaryAdvanceSlip />} />
          <Route path="/tools/slips/security-deposit" element={<SecurityDepositSlip />} />
          <Route path="/tools/hr/leave" element={<LeaveCalculator />} />
          <Route path="/tools/hr/salary-slip" element={<SalarySlipGenerator />} />
          <Route path="/tools/hr/employee-id" element={<EmployeeIdGenerator />} />
          <Route path="/tools/hr/attendance" element={<AttendanceCalculator />} />
          <Route path="/tools/hr/org-chart" element={<OrgChartGenerator />} />
          <Route path="/tools/legal/word-counter" element={<WordCounter />} />
          <Route path="/tools/legal/case-number" element={<CaseNumberGenerator />} />
          <Route path="/tools/legal/document-id" element={<DocumentIdGenerator />} />
          <Route path="/tools/marketing/meta-tags" element={<MetaTagsGenerator />} />
          <Route path="/tools/marketing/character-counter" element={<CharacterCounter />} />
          <Route path="/tools/marketing/social-preview" element={<SocialPreview />} />
          <Route path="/tools/sales/commission" element={<CommissionCalculator />} />
          <Route path="/tools/sales/discount" element={<DiscountCalculator />} />
          <Route path="/tools/sales/quote" element={<QuoteGenerator />} />
          <Route path="/tools/support/ticket-id" element={<TicketIdGenerator />} />
          <Route path="/tools/support/faq" element={<FaqGenerator />} />
          <Route path="/tools/support/response-template" element={<ResponseTemplate />} />
          <Route path="/tools/operations/inventory" element={<InventoryCalculator />} />
          <Route path="/tools/operations/capacity" element={<CapacityCalculator />} />
          <Route path="/tools/operations/shipping" element={<ShippingCalculator />} />
          <Route path="/tools/procurement/po" element={<PurchaseOrderGenerator />} />
          <Route path="/tools/procurement/vendor-comparison" element={<VendorComparison />} />
          <Route path="/tools/qa/bug-report" element={<BugReportTemplate />} />
          <Route path="/tools/qa/test-case" element={<TestCaseGenerator />} />
          <Route path="/tools/qa/release-notes" element={<ReleaseNotesGenerator />} />
          <Route path="/tools/student/citation" element={<CitationGenerator />} />
          <Route path="/tools/student/word-counter" element={<EssayWordCounter />} />
          <Route path="/tools/student/pomodoro" element={<PomodoroTimer />} />
          <Route path="/tools/student/flashcards" element={<FlashcardGenerator />} />
          <Route path="/tools/student/reading-time" element={<ReadingTimeCalculator />} />
          <Route path="/tools/student/study-planner" element={<StudyPlanner />} />
          <Route path="/tools/student/note-outline" element={<NoteOutlineGenerator />} />
          <Route path="/tools/student/gpa" element={<GpaCalculator />} />
          <Route path="/tools/freelancer/platform-fee" element={<PlatformFeeCalculator />} />
          <Route path="/tools/freelancer/project-rate" element={<ProjectRateCalculator />} />
          <Route path="/tools/freelancer/timesheet" element={<TimesheetGenerator />} />
          <Route path="/tools/freelancer/receipt" element={<ReceiptGenerator />} />
          <Route path="/tools/freelancer/mileage" element={<MileageCalculator />} />
          <Route path="/tools/freelancer/self-employment-tax" element={<SelfEmploymentTaxEstimator />} />
          <Route path="/tools/json/formatter" element={<JsonFormatter />} />
          <Route path="/tools/json/validator" element={<JsonValidator />} />
          <Route path="/tools/json/minifier" element={<JsonMinifier />} />
          <Route path="/tools/json/yaml" element={<JsonYaml />} />
          <Route path="/tools/json/xml" element={<JsonXml />} />
          <Route path="/tools/csv/json" element={<CsvJson />} />
          <Route path="/tools/encode/base64" element={<Base64 />} />
          <Route path="/tools/encode/url" element={<UrlEncode />} />
          <Route path="/tools/debug/jwt" element={<JwtDecoder />} />
          <Route path="/tools/debug/hash" element={<HashGenerator />} />
          <Route path="/tools/debug/uuid" element={<UuidGenerator />} />
          <Route path="/tools/debug/regex" element={<RegexTester />} />
          <Route path="/tools/debug/cron" element={<CronBuilder />} />
          <Route path="/tools/debug/timestamp" element={<TimestampConverter />} />
          <Route path="/tools/debug/case-converter" element={<CaseConverter />} />
          <Route path="/tools/debug/password" element={<PasswordGenerator />} />
          <Route path="/tools/debug/password-strength" element={<PasswordStrengthChecker />} />
          <Route path="/tools/debug/color" element={<ColorConverter />} />
          <Route path="/tools/debug/lorem" element={<LoremIpsum />} />
          <Route path="/tools/compare/diff" element={<DiffTool />} />
          <Route path="/tools/api/curl" element={<CurlConverter />} />
          <Route path="/tools/data/faker" element={<FakerData />} />
          <Route path="/tools/data/images" element={<DummyImages />} />
          <Route path="/tools/data/videos" element={<DummyVideos />} />
          <Route path="/tools/media/compressor" element={<ImageCompressor />} />
          <Route path="/tools/media/resizer" element={<ImageResizer />} />
          <Route path="/tools/media/remove-bg" element={<RemoveBackground />} />
          <Route path="/tools/media/make-transparent" element={<MakeColorTransparent />} />
          <Route path="/tools/media/replace-bg" element={<ReplaceBackground />} />
          <Route path="/tools/media/pdf-images" element={<PdfToImages />} />
          <Route path="/tools/media/mp4-mp3" element={<Mp4ToMp3 />} />
          <Route path="/tools/media/mp3-mp4" element={<Mp3ToMp4 />} />
          <Route path="/tools/json/flatten" element={<JsonFlatten />} />
          <Route path="/tools/json/types" element={<JsonToTypes />} />
          <Route path="/tools/json/csv" element={<JsonToCsv />} />
                <Route path="*" element={<Navigate to="/choose-tools" replace />} />
              </Routes>
              </ToolErrorBoundary>
              </div>
              </div>
            </main>
            </div>
            <SiteFooter />
            {!onSuggestionsPage && (
              <button
                type="button"
                onClick={() => navigate('/tools/general/suggestions')}
                className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-[70] inline-flex items-center gap-2 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-3 text-sm font-semibold shadow-[0_12px_28px_rgba(0,0,0,0.25)] transition-all hover:translate-y-[-1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)]"
                title="Open tool suggestions"
                aria-label="Open tool suggestions"
              >
                <span aria-hidden="true">⭐</span>
                <span className="hidden sm:inline">Request Tool</span>
              </button>
            )}
            <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
