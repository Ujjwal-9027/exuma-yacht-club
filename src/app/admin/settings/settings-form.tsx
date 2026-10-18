"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveSiteSettingsAction, type ActionState } from "@/app/admin/actions";

const initialState: ActionState = { error: null };

export function SettingsForm({
  values,
}: {
  values: {
    businessName: string;
    contactEmail: string;
    addressStreet?: string;
    addressLocality?: string;
    addressCountry?: string;
    addressPoBox?: string;
    marinaPhone?: string;
    restaurantPhone?: string;
    whatsappLabel?: string;
    vhfChannel?: string;
    googleMapsUrl?: string;
    socialFacebook?: string;
    socialInstagram?: string;
    inquiryNotificationEmail?: string;
    orderNotificationEmail?: string;
    resnexusBookingUrl: string;
    dockwaUrl: string;
    whatsappNumber: string;
    seoTitle: string;
    seoDescription: string;
  };
}) {
  const [state, formAction, pending] = useActionState(
    saveSiteSettingsAction,
    initialState,
  );
  return (
    <form
      action={formAction}
      className="border border-sand-300 bg-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="businessName" className="field-label">
            Business name
          </label>
          <input
            id="businessName"
            name="businessName"
            required
            defaultValue={values.businessName}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="contactEmail" className="field-label">
            Contact email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={values.contactEmail}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="marinaPhone" className="field-label">
            Marina & Dock Office phone
          </label>
          <input
            id="marinaPhone"
            name="marinaPhone"
            type="tel"
            defaultValue={values.marinaPhone ?? ""}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="restaurantPhone" className="field-label">
            Restaurant & Bar phone
          </label>
          <input
            id="restaurantPhone"
            name="restaurantPhone"
            type="tel"
            defaultValue={values.restaurantPhone ?? ""}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="whatsappLabel" className="field-label">
            WhatsApp display number
          </label>
          <input
            id="whatsappLabel"
            name="whatsappLabel"
            type="tel"
            defaultValue={values.whatsappLabel ?? ""}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="vhfChannel" className="field-label">
            VHF channel
          </label>
          <input
            id="vhfChannel"
            name="vhfChannel"
            defaultValue={values.vhfChannel ?? ""}
            className="field"
          />
        </div>
        <div className="sm:col-span-2 border-t border-sand-200 pt-5">
          <h2 className="font-display text-2xl text-navy-900">
            Social media links
          </h2>
          <p className="mt-1.5 text-xs text-ink-400">
            Configured profiles appear as icons in the public footer.
          </p>
        </div>
        <div>
          <label htmlFor="socialFacebook" className="field-label">
            Facebook URL
          </label>
          <input
            id="socialFacebook"
            name="socialFacebook"
            type="url"
            defaultValue={values.socialFacebook ?? ""}
            className="field"
            placeholder="https://www.facebook.com/..."
          />
        </div>
        <div>
          <label htmlFor="socialInstagram" className="field-label">
            Instagram URL
          </label>
          <input
            id="socialInstagram"
            name="socialInstagram"
            type="url"
            defaultValue={values.socialInstagram ?? ""}
            className="field"
            placeholder="https://www.instagram.com/..."
          />
        </div>
        <div>
          <label htmlFor="addressStreet" className="field-label">
            Street address
          </label>
          <input
            id="addressStreet"
            name="addressStreet"
            defaultValue={values.addressStreet ?? ""}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="addressLocality" className="field-label">
            Town / locality
          </label>
          <input
            id="addressLocality"
            name="addressLocality"
            defaultValue={values.addressLocality ?? ""}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="addressCountry" className="field-label">
            Country
          </label>
          <input
            id="addressCountry"
            name="addressCountry"
            defaultValue={values.addressCountry ?? ""}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="addressPoBox" className="field-label">
            Postal address / P.O. Box
          </label>
          <input
            id="addressPoBox"
            name="addressPoBox"
            defaultValue={values.addressPoBox ?? ""}
            className="field"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="googleMapsUrl" className="field-label">
            Google Maps directions URL
          </label>
          <input
            id="googleMapsUrl"
            name="googleMapsUrl"
            type="url"
            defaultValue={values.googleMapsUrl ?? ""}
            className="field"
            placeholder="https://maps.google.com/..."
          />
        </div>
        <div>
          <label htmlFor="inquiryNotificationEmail" className="field-label">
            Inquiry notification email
          </label>
          <input
            id="inquiryNotificationEmail"
            name="inquiryNotificationEmail"
            type="email"
            defaultValue={values.inquiryNotificationEmail ?? ""}
            className="field"
          />
          <p className="mt-1.5 text-xs text-ink-400">
            Contact, dining, dockage, stay, and fuel queries.
          </p>
        </div>
        <div>
          <label htmlFor="orderNotificationEmail" className="field-label">
            New order notification email
          </label>
          <input
            id="orderNotificationEmail"
            name="orderNotificationEmail"
            type="email"
            defaultValue={values.orderNotificationEmail ?? ""}
            className="field"
          />
          <p className="mt-1.5 text-xs text-ink-400">
            New shop orders and payment updates.
          </p>
        </div>
        <div>
          <label htmlFor="resnexusBookingUrl" className="field-label">
            ResNexus booking URL
          </label>
          <input
            id="resnexusBookingUrl"
            name="resnexusBookingUrl"
            type="url"
            defaultValue={values.resnexusBookingUrl}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="dockwaUrl" className="field-label">
            Dockwa booking URL
          </label>
          <input
            id="dockwaUrl"
            name="dockwaUrl"
            type="url"
            defaultValue={values.dockwaUrl}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="whatsappNumber" className="field-label">
            WhatsApp number
          </label>
          <input
            id="whatsappNumber"
            name="whatsappNumber"
            inputMode="tel"
            defaultValue={values.whatsappNumber}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="seoTitle" className="field-label">
            SEO title
          </label>
          <input
            id="seoTitle"
            name="seoTitle"
            required
            defaultValue={values.seoTitle}
            className="field"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="seoDescription" className="field-label">
            SEO description
          </label>
          <textarea
            id="seoDescription"
            name="seoDescription"
            rows={3}
            defaultValue={values.seoDescription}
            className="field resize-y"
          />
        </div>
      </div>
      {state.error && (
        <p
          role="alert"
          className="mt-5 border border-[#e3c2bb] bg-[#fbf1ef] p-3 text-sm text-[#8f3526]"
        >
          {state.error}
        </p>
      )}
      <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-sand-200 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 border border-navy-900 bg-navy-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory-50 hover:bg-transparent hover:text-navy-900 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="h-4 w-4" aria-hidden="true" />
          )}
          {pending ? "Saving" : "Save settings"}
        </button>
        <p className="text-xs text-ink-400">
          Secrets and payment credentials are intentionally excluded from this
          page.
        </p>
      </div>
    </form>
  );
}
