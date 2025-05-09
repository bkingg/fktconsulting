import urlFor from "@/lib/urlFor";
import { sanityFetch } from "@/sanity/client";
import { groq, PortableText, SanityDocument } from "next-sanity";
import Link from "next/link";
import Image from "next/image";

interface FooterMenu {
  _key: string;
  title: string;
  menu: MenuItems;
}

interface MenuItems {
  items: MenuItem[];
}

interface MenuItem {
  _key: string;
  title: string;
  linkType: string;
  internalLink: {
    _type: string;
    slug: { current: string };
  };
  externalUrl: string;
}

export default async function Footer() {
  const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
    // Header
    logo,
    // Footer
    footerBgImage,
    footerLogo,
    footerDescription,
    footerMenus[]{
      _key, title, menu->{
        items[]{
          _key,
          title,
          linkType,
          internalLink->{
            _type,
            slug
          },
          externalUrl
        }
      }
    },
    facebook,
    twitter,
    instagram,
    linkedin,

    contactPageTitle,
    contactPageImage,
    showMap,
    contactPageSubTitle,
    contactPageDescription,
    phone,
    address,
    email,
  }`;

  const siteSettings = await sanityFetch<SanityDocument>({
    query: SITE_SETTINGS_QUERY,
  });
  const footerMenus = siteSettings.footerMenus;
  return (
    <footer
      style={{
        backgroundColor: "rgba(20, 85, 24, 1)",
        backgroundImage: siteSettings.footerBgImage
          ? `linear-gradient(to top, rgba(20, 85, 24, 0.7), rgba(20, 85, 24, 1) 95%), url(${urlFor(siteSettings.footerBgImage).width(800).url()})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="footer text-light"
    >
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-md-3">
            {siteSettings.footerLogo && (
              <Image
                src={urlFor(siteSettings.footerLogo)
                  .width(300)
                  .crop("center")
                  .url()}
                width={200}
                height={0}
                alt="Hepo Dakar"
                title="Hepo Dakar"
                className="img-fluid mb-3"
              />
            )}
            {siteSettings.footerDescription && (
              <p>{siteSettings.footerDescription}</p>
            )}
          </div>
          <div className="footer__address col-sm-6 col-md-3 mb-3">
            <h5 className="footer__heading">{siteSettings.contactPageTitle}</h5>
            <PortableText value={siteSettings.address} />
            <br />
            <PortableText value={siteSettings.email} />
            <PortableText value={siteSettings.phone} />
          </div>
          {footerMenus?.map(({ _key, title, menu }: FooterMenu) => {
            console.log("menu", menu);
            return (
              <div key={_key} className="col-sm-6 col-md-3 mb-3">
                <h5 className="footer__heading">{title}</h5>
                <ul className="nav flex-column">
                  {menu.items?.map((item: MenuItem) => (
                    <li className="nav-item mb-2" key={item._key}>
                      <Link
                        className="nav-link p-0"
                        href={
                          item.linkType === "internal"
                            ? `/${item.internalLink?._type}s/${item.internalLink?.slug.current}`
                            : item.externalUrl
                        }
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="footer__newsletter col-sm-6 col-md-3 mb-3">
            <form>
              <div className="row d-flex align-items-center">
                <h5 className="footer__heading">Newsletter</h5>
                <p>Résumé mensuel de nos activités</p>
                <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                  <label htmlFor="newsletter1" className="visually-hidden">
                    Adresse Email
                  </label>
                  <input
                    id="newsletter1"
                    type="text"
                    className="form-control"
                    placeholder="Email address"
                  />
                  <button className="btn btn-primary" type="button">
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="text-center py-5">
          <p>© 2025 FKT Consulting</p>
          <ul className="list-unstyled d-flex justify-content-center footer__social">
            {siteSettings.twitter && (
              <li>
                <Link
                  className="link-body-emphasis"
                  href={siteSettings.twitter}
                  target="_blank"
                >
                  <i className="bi bi-twitter"></i>
                </Link>
              </li>
            )}
            {siteSettings.instagram && (
              <li className="ps-4">
                <Link
                  className="link-body-emphasis"
                  href={siteSettings.instagram}
                  target="_blank"
                >
                  <i className="bi bi-instagram"></i>
                </Link>
              </li>
            )}
            {siteSettings.facebook && (
              <li className="ps-4">
                <Link
                  className="link-body-emphasis"
                  href={siteSettings.facebook}
                  target="_blank"
                >
                  <i className="bi bi-facebook"></i>
                </Link>
              </li>
            )}
            {siteSettings.linkedin && (
              <li className="ps-4">
                <Link
                  className="link-body-emphasis"
                  href={siteSettings.linkedin}
                  target="_blank"
                >
                  <i className="bi bi-linkedin"></i>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
}
