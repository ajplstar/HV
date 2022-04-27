import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Dialog, Transition } from '@headlessui/react'
import { DownloadButton } from './DownloadBtnGtoup'

function TrackContainer({ track, title }: { track: Plyr.Track; title: string }) {
  const { t } = useTranslation()
  return (
    <>
      <div className="mt-4 w-full rounded border border-gray-600/10 bg-gray-50 p-2 ">
        {/* <div className="h-4 w-4 rounded-full shadow-lg"></div> */}
        <h3 className="text-md w-full font-semibold  uppercase tracking-wider text-black">{title}</h3>
        <div className="mt-2 w-full ">
          <h4 className="w-full py-2 text-xs font-medium uppercase tracking-wider">{t('Track label')}</h4>
          <input
            className="w-full rounded border border-gray-600/10 p-2.5 font-mono focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-600 dark:text-white dark:focus:ring-blue-700"
            defaultValue={track.label}
            onChange={value => {
              track.label = value.target.value
            }}
          />
          <div className="mt-2 w-full ">
            <h4 className="w-full py-2 text-xs font-medium uppercase tracking-wider">{t('Track src')}</h4>
            <input
              className="w-full rounded border border-gray-600/10 p-2.5 font-mono focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-600 dark:text-white dark:focus:ring-blue-700"
              defaultValue={track.src}
              onChange={value => {
                track.src = value.target.value
              }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="flex-1">
              <h4 className="py-2 text-xs font-medium uppercase tracking-wider">{t('Track lang')}</h4>
              <input
                className="rounded border border-gray-600/10 p-2.5 font-mono focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-600 dark:text-white dark:focus:ring-blue-700"
                defaultValue={track.srcLang}
                onChange={value => {
                  track.srcLang = value.target.value
                }}
              />
            </div>
            <div className="flex-1">
              <h4 className="py-2 text-xs font-medium uppercase tracking-wider">{t('Track kind')}</h4>
              <select
                className="rounded border border-gray-600/10 p-2.5 font-mono focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-600 dark:text-white dark:focus:ring-blue-700"
                defaultValue={track.kind}
                onChange={option => {
                  track.kind = option.target.value as Plyr.TrackKind
                }}
              >
                <option value="subtitles">subtitles</option>
                <option value="captions">captions</option>
                <option value="descriptions">descriptions</option>
                <option value="chapters">chapters</option>
                <option value="metadata">metadata</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function CustomMediaTrackMenu({
  path,
  tracks,
  setTracks,
  menuOpen,
  setMenuOpen,
}: {
  path: string
  tracks: Plyr.Track[]
  setTracks: Dispatch<SetStateAction<Plyr.Track[]>>
  menuOpen: boolean
  setMenuOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { t } = useTranslation()

  // const hashedToken = getStoredToken(path)

  // Focus on input automatically when menu modal opens
  //const focusInputRef = useRef<HTMLInputElement>(null)
  const closeMenu = () => setMenuOpen(false)

  // const readablePath = getReadablePath(path)
  // const filename = readablePath.substring(readablePath.lastIndexOf('/') + 1)
  const [modedTracks, setModedTracks] = useState<Plyr.Track[]>(JSON.parse(JSON.stringify(tracks)))
  useEffect(() => {
    if (menuOpen) setModedTracks(JSON.parse(JSON.stringify(tracks)))
  }, [tracks, menuOpen])

  return (
    <Transition appear show={menuOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeMenu} /* initialFocus={focusInputRef} */
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-white/60 dark:bg-gray-800/60" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block max-h-[80vh] w-full max-w-3xl transform overflow-hidden overflow-y-scroll rounded border border-gray-400/30 bg-white p-4 text-left align-middle text-sm shadow-xl transition-all dark:bg-gray-900 dark:text-white">
              <Dialog.Title as="h3" className="py-2 text-xl font-bold">
                {t('Customise player track')}
              </Dialog.Title>
              <Dialog.Description as="p" className="py-2 opacity-80">
                {t('Customise tracks of the media player.')}{' '}
              </Dialog.Description>

              <div className="my-4">
                {modedTracks.map((track, index) => (
                  <TrackContainer key={JSON.stringify(track)} track={track} title={`#${index}`}></TrackContainer>
                ))}
              </div>

              <div className="float-right flex flex-wrap gap-4">
                <DownloadButton
                  onClickCallback={() => {
                    setModedTracks([
                      ...modedTracks,
                      {
                        label: '',
                        src: '',
                        kind: 'captions',
                        srcLang: '',
                      },
                    ])
                  }}
                  btnColor="teal"
                  btnText={t('Add track')}
                  btnIcon="plus"
                />
                <DownloadButton
                  onClickCallback={() => {
                    setTracks(modedTracks)
                    closeMenu()
                  }}
                  btnColor="blue"
                  btnText={t('Apply tracks')}
                  btnIcon="download"
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
