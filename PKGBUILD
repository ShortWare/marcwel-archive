pkgname=marcwel-archive
pkgver=1.69.420
pkgrel=1
pkgdesc="The revolutionary archiving software that boldly asks, “What if… bigger is better?”"
arch=('x86_64')
url="https://github.com/ShortWare/marcwel-archive"
license=('Beerware')
depends=('nodejs')
source=('marcwel.js')
sha256sums=('SKIP')

package() {
  install -Dm755 "$srcdir/marcwel.js" "$pkgdir/usr/bin/marcwel"
}
