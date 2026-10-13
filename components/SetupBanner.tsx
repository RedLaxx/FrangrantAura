import { configIssues, isTestMode } from "@/lib/config";

/**
 * Launch preflight banner.
 *
 * Renders only while something the storefront genuinely needs is missing —
 * a real WhatsApp number, a Paystack key, a deployment URL — and disappears on
 * its own the moment those environment variables are set. Because the failure
 * mode it guards against is silent (orders that go nowhere), it is shown in
 * production too, not just in development.
 */
export default function SetupBanner() {
  if (configIssues.length === 0 && !isTestMode) return null;

  return (
    <div
      role="status"
      className="border-b border-amber-400/30 bg-amber-400/[0.08] px-4 py-3 text-amber-100"
    >
      <div className="container-page text-xs leading-relaxed sm:text-[13px]">
        {configIssues.length > 0 && (
          <>
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="shrink-0 rounded-full bg-amber-400/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                Setup needed
              </span>
              <span>
                {configIssues.length === 1
                  ? "One thing still needs configuring before you can take orders:"
                  : `${configIssues.length} things still need configuring before you can take orders:`}
              </span>
            </p>
            <ul className="mt-2 space-y-1.5">
              {configIssues.map((issue) => (
                <li key={issue.id} className="flex gap-2">
                  <span aria-hidden="true" className="text-amber-300/70">
                    •
                  </span>
                  <span>
                    <strong className="font-semibold text-amber-50">
                      {issue.title}.
                    </strong>{" "}
                    <span className="text-amber-100/85">{issue.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {isTestMode && (
          <p className={configIssues.length > 0 ? "mt-2 text-amber-200/90" : "text-amber-200/90"}>
            Paystack is running on a <strong>test</strong> key, so no real money
            can move. Payments become live when you swap in your{" "}
            <code className="rounded bg-black/20 px-1 py-0.5">pk_live_</code>{" "}
            key.
          </p>
        )}
      </div>
    </div>
  );
}
