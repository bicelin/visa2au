import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Clock, ShieldAlert } from 'lucide-react';

const UrgentHelp = () => (
  <section className="py-10 t-bg-body">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto glass-panel border-red-500/20 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl" aria-hidden="true" />
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7 text-red-400" aria-hidden="true" />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold t-text-primary flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" aria-hidden="true" />
              Need Urgent Immigration Help?
            </h3>
            <p className="t-text-faint text-sm mt-1">
              Visa refused, cancelled, withdrawn, or facing a critical deadline? Our team can assist with appeals and urgent applications.
            </p>
          </div>
          <Link
            to="/services/visa-refusals"
            className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 px-5 py-2.5 rounded-xl font-medium hover:bg-red-500/20 transition-colors shrink-0"
          >
            <Clock className="w-4 h-4" />
            Get Urgent Help
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-4 pt-4 border-t t-border flex flex-wrap gap-x-6 gap-y-2 t-text-ghost text-sm">
          <span>Refused visa</span>
          <span className="t-text-ghost">|</span>
          <span>Cancelled visa</span>
          <span className="t-text-ghost">|</span>
          <span>Withdrawn application</span>
          <span className="t-text-ghost">|</span>
          <span>AAT / ART appeal</span>
          <span className="t-text-ghost">|</span>
          <span>Imminent deadline</span>
        </div>
      </div>
    </div>
  </section>
);

export default UrgentHelp;
